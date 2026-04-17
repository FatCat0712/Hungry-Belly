import axios from "axios";
import api from "./api";

export const getPresignedUrlApi = async (files, entityType) => {
  const data = {
    files,
    entityType,
  };

  const response = await api.post(`storage/presigned-urls`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.data;
};

export const uploadPhotoApi = async (uploadUrl, file, contentType) => {
  const response = await axios.put(uploadUrl, file, {
    headers: { "Content-Type": contentType },
  });
  return response.data.data;
};
