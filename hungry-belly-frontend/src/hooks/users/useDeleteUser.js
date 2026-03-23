import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserApi } from "../../services/userService";

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
