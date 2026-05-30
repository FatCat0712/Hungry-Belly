import api from "../../../shared/api/api.js";

const API_URL = "/users";

export const registerUserApi = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUserApi = async (credentials) => {
  const response = await api.post(`auth/login`, credentials);
  return response.data;
};
