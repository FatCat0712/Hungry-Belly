import api from "../../../shared/api/api";

const API_URL = "/users";

export const fetchUsersByPageApi = async ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
} = {}) => {
  const response = await api.post(
    API_URL + "/page",
    {
      pageNum,
      pageSize,
      sortField,
      sortDirection,
      keyword,
    },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return response.data.data;
};

export const fetchStatsApi = async () => {
  const response = await api.get(API_URL + "/stats");
  return response.data.data;
};

export const fetchAllUsersApi = async () => {
  const response = await api.get(API_URL);
  return response.data.data;
};

export const createUserApi = async (userData) => {
  const transferData = {
    ...userData,
    photo:
      userData.photo instanceof File ? userData.photo?.name : userData.photo,
  };
  const data = await api.post(API_URL, transferData, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
};

export const updateUserApi = async (userData) => {
  const transferData = {
    ...userData,
    photo:
      userData.photo instanceof File ? userData.photo?.name : userData.photo,
  };
  const data = await api.put(`${API_URL}/${userData.id}`, transferData, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
};

export const resetPasswordApi = async (userId, userData) => {
  const data = await api.put(`${API_URL}/${userId}/password`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
};

export const deleteUserApi = async (userId) => {
  const data = await api.delete(`${API_URL}/${userId}`);
  return data.data;
};

export const toggleUserStatusApi = async (userId) => {
  const data = await api.patch(`${API_URL}/${userId}/status`);
  return data.data;
};

export const getUserApi = async (userId) => {
  const response = await api.get(`${API_URL}/${userId}`);
  return response.data.data;
};

export const exportUsersApi = async (format) => {
  const response = await api.post(`${API_URL}/export/${format}`, null, {});
  return response.data.data;
};
