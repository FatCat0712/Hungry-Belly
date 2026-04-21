import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTempSessionApi,
  getPresignedUrlApi,
  uploadPhotoApi,
} from "../api/storageService";

export const useUploadPhoto = (queryKey) => {
  const queryClient = useQueryClient();

  const { mutateAsync: uploadPhoto } = useMutation({
    mutationFn: ({ uploadUrl, file, contentType }) =>
      uploadPhotoApi(uploadUrl, file, contentType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return { uploadPhoto };
};

export const useGetPresignedUrl = (module) => {
  const queryClient = useQueryClient();

  const { mutateAsync: getPresignedUrl, error } = useMutation({
    mutationFn: ({ uploadId, files, entityType }) => {
      return getPresignedUrlApi(uploadId, files, entityType);
    },

    onSuccess: () => {
      queryClient.invalidateQueries([module]);
    },
  });

  return { getPresignedUrl, error };
};

export const useCreateTempSession = () => {
  const { mutateAsync: createTempSession } = useMutation({
    mutationFn: () => createTempSessionApi(),
  });

  return { createTempSession };
};
