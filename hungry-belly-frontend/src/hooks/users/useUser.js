import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserApi,
  deleteUserApi,
  fetchStatsApi,
  fetchUsersByPageApi,
  getPresignedUrlApi,
  getUserApi,
  resetPasswordApi,
  toggleUserStatusApi,
  updateUserApi,
  uploadUserPhotoApi,
} from "../../services/userService";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createUser } = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { createUser };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateUser, error } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  return { updateUser, error };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser, error } = useMutation({
    mutationFn: ({ userId }) => deleteUserApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { deleteUser, error };
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  const { mutate: resetPassword, error } = useMutation({
    mutationFn: ({ userId, newPassword }) =>
      resetPasswordApi(userId, { newPassword }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { resetPassword, error };
};

export const useToggleStatus = () => {
  const queryClient = useQueryClient();

  const { mutate: toggleStatus, error } = useMutation({
    mutationFn: ({ userId }) => toggleUserStatusApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { toggleStatus, error };
};

export const useGetPresignedUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: getPresignedUrl, error } = useMutation({
    mutationFn: ({ userId, fileName, contentType }) =>
      getPresignedUrlApi(userId, fileName, contentType),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { getPresignedUrl, error };
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: uploadPhoto } = useMutation({
    mutationFn: ({ uploadUrl, file, contentType }) =>
      uploadUserPhotoApi(uploadUrl, file, contentType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { uploadPhoto };
};

export const useListUsersByPage = ({
  pageNum = 1,
  pageSize = 10,
  sortField = "firstName",
  sortDirection = "asc",
  keyword,
} = {}) => {
  const { data, isLoading } = useQuery({
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

  return { data, isLoading };
};

export const useUserStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await fetchStatsApi();
      console
      return response;
    },
  });

  return { stats };
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
