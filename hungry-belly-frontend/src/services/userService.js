import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/users";

export const fetchUsersApi = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data.data;
};

export const createUserApi = async (userData) => {
  const data = await axios.post(API_URL, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
};

export const updateUserApi = async (userData) => {
  const data = await axios.put(`${API_URL}/${userData.id}`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
};

export const resetPasswordApi = async (userId, userData) => {
  const data = await axios.put(`${API_URL}/${userId}/password`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
};

export const deleteUserApi = async (userId) => {
  const data = await axios.delete(`${API_URL}/${userId}`);
  return data.data;
};

export const toggleUserStatusApi = async (userId) => {
  const data = await axios.patch(`${API_URL}/${userId}/status`);
  return data.data;
};
