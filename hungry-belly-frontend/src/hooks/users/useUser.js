import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserApi,
  deleteUserApi,
  fetchUsersApi,
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

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  return { updateUser };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteUser } = useMutation({
    mutationFn: ({ userId }) => deleteUserApi(userId),
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

export const useGetPresignedUrl = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: getPresignedUrl } = useMutation({
    mutationFn: ({ userId, fileName, contentType }) =>
      getPresignedUrlApi(userId, fileName, contentType),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return { getPresignedUrl };
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

export const useListUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetchUsersApi();
      return response;
    },
  });
  return { users: data || [], isLoading };
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
