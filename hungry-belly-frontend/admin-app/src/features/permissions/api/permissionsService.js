import api from "../../../shared/api/api";

const API_URL = "/permissions";

export const fetchPermissionsApi = async () => {
  const response = await api.get(API_URL);
  return response.data.data;
};
