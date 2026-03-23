import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "../../services/userService";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
