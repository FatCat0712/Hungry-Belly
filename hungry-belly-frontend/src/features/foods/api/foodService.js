import api from "../../../shared/api/api";

const API_URL = "/foods";

export const getFoodsApi = async ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
  const response = await api.post(
    API_URL + "/page",
    { pageNum, pageSize, sortField, sortDirection, keyword },
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data.data;
};

export const getFoodByIdApi = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createFoodApi = async (data) => {
  const response = await api.post(API_URL, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.data;
};

export const updateFoodApi = async (id, data) => {
  const response = await api.put(`${API_URL}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data.data;
};

export const updateFoodStatusApi = async (id) => {
  const response = await api.patch(`${API_URL}/${id}/status`);
  return response.data;
};

export const deleteFoodApi = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);

  return response.data.data;
};
