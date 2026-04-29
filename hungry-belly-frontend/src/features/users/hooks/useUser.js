import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserApi,
  deleteUserApi,
  exportUsersApi,
  fetchStatsApi,
  fetchUsersByPageApi,
  getUserApi,
  resetPasswordApi,
  toggleUserStatusApi,
  updateUserApi,
} from "../api/userService";

const DEFAULT_USER_STATS = {
  activeUsers: 0,
  totalUsers: 0,
};

export const useCreateUser = () => {
  const { mutateAsync: createUser } = useMutation({
    mutationFn: createUserApi,
  });

  return { createUser };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateUser, error } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: (data) => {
      // Invalidate the users query to ensure fresh data after update
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(
        { queryKey: ["restaurant", data.id] },
        { exact: true },
      );
    },
  });

  return { updateUser, error };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser } = useMutation({
    mutationFn: (userId) => deleteUserApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { deleteUser };
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  const { mutate: resetPassword } = useMutation({
    mutationFn: ({ userId, newPassword }) =>
      resetPasswordApi(userId, { newPassword }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { resetPassword };
};

export const useToggleStatus = () => {
  const queryClient = useQueryClient();

  const { mutate: toggleStatus } = useMutation({
    mutationFn: ({ userId }) => toggleUserStatusApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { toggleStatus };
};

export const useListUsersByPage = ({
  pageNum = 1,
  pageSize = 10,
  sortField = "firstName",
  sortDirection = "asc",
  keyword,
} = {}) => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["users", pageNum, pageSize, sortField, sortDirection, keyword],
    queryFn: async () => {
      const response = await fetchUsersByPageApi({
        pageNum,
        pageSize,
        sortField,
        sortDirection,
        keyword,
      });
      return response;
    },
  });

  return { page, isLoading };
};

export const useUserStats = () => {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await fetchStatsApi();
      return response;
    },
  });

  return {
    stats: data ?? DEFAULT_USER_STATS,
    hasLoadedStats: data !== undefined,
    isLoading: isPending,
    isFetching,
  };
};

export const useGetUser = (userId) => {
  const { data, isLoading } = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await getUserApi(userId);
      return response;
    },
  });
  return { user: data || {}, isLoading };
};

export const useExportUsers = (format) => {
  const { mutateAsync: exportUsers } = useMutation({
    mutationFn: () => exportUsersApi(format),
  });

  return { exportUsers };
};
