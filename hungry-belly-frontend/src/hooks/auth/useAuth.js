import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCurrentUserApi,
  getAccountPresignedUrlApi,
  updateAccountApi,
} from "../../services/authService";

export const useFetchCurrentUser = ({ enabled = true } = {}) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUserApi,
    retry: false,
    enabled,
  });

  return {
    currentUser: data || null,
    error,
    isLoading,
    refetch,
  };
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateAccount, error } = useMutation({
    mutationFn: updateAccountApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  return { updateAccount, error };
};

export const useGetAccountPresignedUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: getPresignedUrl, error } = useMutation({
    mutationFn: ({ userId, fileName, contentType }) =>
      getAccountPresignedUrlApi(userId, fileName, contentType),
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
    },
  });

  return { getPresignedUrl, error };
};
