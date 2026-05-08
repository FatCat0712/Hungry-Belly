import api from "../../../shared/api/api";

const API_URL = "/auth";

export const loginApi = async (email, password) => {
  const response = await api.post(`${API_URL}/login`, { email, password });
  return response.data.data;
};

export const fetchCurrentUserApi = async () => {
  const response = await api.get(`${API_URL}/me`);
  return response.data.data;
};

export const refreshTokenApi = async () => {
  const response = await api.post(`${API_URL}/refresh-token`);
  return response.data.data;
};

export const logoutApi = async () => {
  const response = await api.post(`${API_URL}/logout`);
  return response.data.data;
};

export const updateAccountApi = async (userData) => {
  const response = await api.put(`${API_URL}/update-account`, userData);
  return response.data.data;
};

export const getAccountPresignedUrlApi = async (
  userId,
  fileName,
  contentType,
) => {
  const data = {
    folderName: "user-photos/" + userId,
    fileName,
    contentType,
  };

  const response = await api.post(`${API_URL}/presigned`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.data;
};
