import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurantByIdApi,
  getRestaurantsApi,
  updateRestaurantApi,
  updateRestaurantStatusApi,
} from "../api/restaurantService";

export const useGetRestaurantById = (restaurantId) => {
  const { data, isLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantByIdApi(restaurantId),
  });

  return { restaurant: data || {}, isLoading };
};

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

export const useUpdateRestaurantStatus = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateRestaurantStatus } = useMutation({
    mutationFn: (restaurantId) => updateRestaurantStatusApi(restaurantId),
    onSuccess: () => {
      // Invalidate both the paginated list and individual restaurant queries to ensure fresh data
      queryClient.invalidateQueries(["restaurants"]);
    },
  });

  return { updateRestaurantStatus };
};

export const useRestaurantDetail = (restaurantId) => {
  const query = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantByIdApi(restaurantId),
    enabled: Boolean(restaurantId),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) {
        return false;
      }

      return failureCount < 1;
    },
  });

  return {
    ...query,
    data: query.data,
  };
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateRestaurant } = useMutation({
    mutationFn: ({ id, data }) => updateRestaurantApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
    },
  });

  return { updateRestaurant };
};
