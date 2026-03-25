import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadUserPhotoApi } from "../../services/userService";

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  const { mutate: uploadPhoto } = useMutation({
    mutationFn: ({ userId, photo }) => uploadUserPhotoApi(userId, photo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { uploadPhoto };
};
