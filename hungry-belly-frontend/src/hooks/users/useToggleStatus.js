import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserStatusApi } from "../../services/userService";

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
