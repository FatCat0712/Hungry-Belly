import axios from "axios";
import { refreshTokenApi } from "./authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRedirectingToLogin = false;
let isRedirectingToAccessDenied = false;
// Shared in-flight refresh promise. Prevents duplicate refresh calls when
// multiple requests fail with 401 at the same time.
let refreshPromise = null;

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

const goToAccessDenied = () => {
  // Prevent repeated redirects when many requests fail together.
  if (isRedirectingToAccessDenied) {
    return;
  }

  // If user is already on access denied page, no need to redirect.
  if (window.location.pathname === "/access-denied") {
    return;
  }

  isRedirectingToAccessDenied = true;
  window.location.href = "/access-denied";
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
    const isOnAccessDeniedPage = window.location.pathname === "/access-denied";

    const isUnauthorized = status === 401;
    const isForbidden = status === 403;

    // Forbidden should go to access denied page, not login.
    if (isForbidden) {
      if (isOnAccessDeniedPage || isLoginRequest || isRefreshRequest) {
        return Promise.reject(error);
      }

      goToAccessDenied();
      return Promise.reject(error);
    }

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
      return Promise.reject(error);
    }

    // Do not attempt refresh while already on login page.
    if (isOnLoginPage) {
      return Promise.reject(error);
    }

    // A refresh is already in-flight from another concurrent request.
    // Swallow this 401 silently: wait for the shared refresh to settle,
    // then retry without marking _retry (the queued request gets a clean retry).
    if (refreshPromise) {
      try {
        await refreshPromise;
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    // If we already retried this request once (no refresh was in-flight),
    // the new token also failed — send the user to login.
    if (originalRequest._retry) {
      goToLogin();
      return Promise.reject(error);
    }

    // First 401 with no refresh in-flight: kick off a single refresh for all.
    originalRequest._retry = true;
    refreshPromise = refreshTokenApi().finally(() => {
      refreshPromise = null;
    });

    try {
      await refreshPromise;
      return api(originalRequest);
    } catch {
      goToLogin();
      return Promise.reject(error);
    }
  },
);

export default api;
