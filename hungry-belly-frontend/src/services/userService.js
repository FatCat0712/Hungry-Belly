import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/users";

export const fetchUsersApi = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data.data;
};

export const createUserApi = async (userData) => {
  const transferData = {
    ...userData,
    photo:
      userData.photo instanceof File ? userData.photo?.name : userData.photo,
  };
  const data = await axios.post(API_URL, transferData, {
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
  const data = await axios.put(`${API_URL}/${userData.id}`, transferData, {
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

export const uploadUserPhotoApi = async (uploadUrl, file, contentType) => {
  const data = await axios.put(uploadUrl, file, {
    headers: { "Content-Type": contentType },
  });
  return data.data;
};

export const getUserApi = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data.data;
};

export const getPresignedUrlApi = async (userId, fileName, contentType) => {
  const data = {
    folderName: "user-photos/" + userId,
    fileName,
    contentType,
  };

  const response = await axios.post(`${API_URL}/presigned`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.data;
};
