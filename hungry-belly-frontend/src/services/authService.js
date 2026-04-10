import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data.data;
};
