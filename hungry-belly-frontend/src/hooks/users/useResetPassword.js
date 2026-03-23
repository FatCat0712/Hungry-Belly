import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPasswordApi } from "../../services/userService";

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
