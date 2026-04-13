import api from "./api";

const API_URL = "/restaurants";

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
