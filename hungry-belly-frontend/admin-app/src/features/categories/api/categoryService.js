import api from "../../../shared/api/api";

const API_URL = "/categories";

export const fetchCategoriesApi = async ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
  const response = await api.post(
    "/categories/roots",
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

export const fetchCategoryChildrenApi = async (parentId) => {
  const response = await api.get(`${API_URL}/${parentId}/children`);
  return response.data.data;
};

export const fetchCategoryByIdApi = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const fetchCategoryTreeApi = async () => {
  const response = await api.get(`${API_URL}/in-form`);
  return response.data.data;
};

export const updateCategoryApi = async (id, categoryData) => {
  const response = await api.put(`${API_URL}/${id}`, categoryData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const createCategoryApi = async (categoryData) => {
  const response = await api.post(`${API_URL}`, categoryData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateCategoryStatusApi = async (id) => {
  const response = await api.patch(`${API_URL}/${id}/status`);
  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

export const exportCategoriesApi = async (format) => {
  const response = await api.post(`${API_URL}/export/${format}`);
  return response.data.data;
};
