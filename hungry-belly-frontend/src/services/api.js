import axios from "axios";
import { refreshToken } from "./authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRedirectingToLogin = false;

const swallowAfterAuthRedirect = () => new Promise(() => {});

const goToLogin = () => {
  // Prevent repeated redirects when many requests fail together.
  if (isRedirectingToLogin) {
    return;
  }

  // If user is already on login page, no need to redirect.
  if (window.location.pathname === "/login") {
    return;
  }

  isRedirectingToLogin = true;
  window.location.href = "/login";
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config || {};
    const status = error?.response?.status;
    const requestUrl = originalRequest.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");
    const isRefreshRequest = requestUrl.includes("/auth/refresh-token");
    const isOnLoginPage = window.location.pathname === "/login";

    const isUnauthorized = status === 401 || status === 403;

    // Handle only auth-status errors here. Other errors should continue normally.
    if (!isUnauthorized) {
      return Promise.reject(error);
    }

    // Let login request failures propagate so the form can show an error.
    if (isLoginRequest) {
      return Promise.reject(error);
    }

    // If refresh endpoint itself is unauthorized, send user to login.
    if (isRefreshRequest) {
      goToLogin();
      return swallowAfterAuthRedirect();
    }

    // Do not attempt refresh while already on login page.
    if (isOnLoginPage) {
      return Promise.reject(error);
    }

    // If we already retried this request once, stop and go to login.
    if (originalRequest._retry) {
      goToLogin();
      return swallowAfterAuthRedirect();
    }

    // First 401 for this request: try refresh token once.
    originalRequest._retry = true;

    try {
      await refreshToken();
      return api(originalRequest);
    } catch {
      goToLogin();
      return swallowAfterAuthRedirect();
    }
  },
);

export default api;
