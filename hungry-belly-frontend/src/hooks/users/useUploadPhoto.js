import { useMutation } from "@tanstack/react-query";
import { uploadUserPhotoApi } from "../../services/userService";

export const useUploadPhoto = () => {
  const { mutate: uploadPhoto } = useMutation({
    mutationFn: ({ userId, photo }) => uploadUserPhotoApi(userId, photo),
  });

  return { uploadPhoto };
};
