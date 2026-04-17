import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPresignedUrlApi, uploadPhotoApi } from "../api/storageService";

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
    mutationFn: ({ files, entityType }) =>
      getPresignedUrlApi(files, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries([module]);
    },
  });

  return { getPresignedUrl, error };
};
