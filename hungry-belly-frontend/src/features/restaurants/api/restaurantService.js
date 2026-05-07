import api from "../../../shared/api/api";

const API_URL = "/restaurants";

export const getRestaurantByIdApi = async (restaurantId) => {
  const response = await api.get(`${API_URL}/${restaurantId}`);
  return response.data.data;
};

export const getRestaurantsApi = async ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
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

export const updateRestaurantStatusApi = async (restaurantId) => {
  const response = await api.patch(`${API_URL}/${restaurantId}/status`);
  return response.data.data;
};

export const updateRestaurantApi = async (id, data) => {
  const response = await api.put(`${API_URL}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

export const createRestaurantApi = async (data) => {
  const response = await api.post(API_URL, data, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data.data;
};

export const deleteRestaurantApi = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

export const changeMemberRoleApi = async (restaurantId, userId, newRole) => {
  const response = await api.patch(
    `${API_URL}/${restaurantId}/members/${userId}/role`,
    { role: newRole },
  );
  return response.data;
};
