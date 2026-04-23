import api from "../../../shared/api/api";

export const fetchCategoriesApi = async () => {
  const response = await api.get("/categories");
  return response.data.data;
};

export const fetchCategoryByIdApi = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data.data;
};

export const fetchCategoryTreeApi = async () => {
  const response = await api.get("/categories/in-form");
  return response.data.data;
};

export const updateCategoryApi = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};
