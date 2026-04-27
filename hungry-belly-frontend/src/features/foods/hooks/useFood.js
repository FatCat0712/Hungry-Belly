import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFoodApi,
  deleteFoodApi,
  getFoodByIdApi,
  getFoodsApi,
  updateFoodApi,
  updateFoodStatusApi,
} from "../api/foodService";

export const useListFoodsByPage = ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["foods", pageNum, pageSize, sortField, sortDirection, keyword],
    queryFn: () =>
      getFoodsApi({ pageNum, pageSize, sortField, sortDirection, keyword }),
  });

  return { data, isLoading };
};

export const useGetFoodById = (id) => {
  const { data, isLoading } = useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodByIdApi(id),
    enabled: Boolean(id),
  });

  return { food: data, isLoading };
};

export const useCreateFood = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createFood } = useMutation({
    mutationFn: (data) => createFoodApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { createFood };
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateFood } = useMutation({
    mutationFn: ({ id, data }) => updateFoodApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { updateFood };
};

export const useUpdateFoodStatus = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateFoodStatus } = useMutation({
    mutationFn: (id) => updateFoodStatusApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { updateFoodStatus };
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteFood } = useMutation({
    mutationFn: (id) => deleteFoodApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { deleteFood };
};
