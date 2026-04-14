import axios from "axios";
import api from "./api";

export const getPresignedUrlApi = async (module, id, fileName, contentType) => {
  const data = {
    folderName: `${module}-photos/${id}`,
    fileName,
    contentType,
  };

  const response = await api.post(`storage/presigned`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.data;
};

export const uploadPhotoApi = async (uploadUrl, file, contentType) => {
  const data = await axios.put(uploadUrl, file, {
    headers: { "Content-Type": contentType },
  });

  return data.data;
};
