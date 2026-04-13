import { useQuery } from "@tanstack/react-query";
import { getRestaurantsApi } from "../../services/restaurantService";

export const useListRestaurantsByPage = ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      "restaurants",
      pageNum,
      pageSize,
      sortField,
      sortDirection,
      keyword,
    ],
    queryFn: () =>
      getRestaurantsApi({
        pageNum,
        pageSize,
        sortField,
        sortDirection,
        keyword,
      }),
  });

  return { data, isLoading };
};
