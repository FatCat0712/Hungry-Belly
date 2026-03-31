import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoleApi } from "../../services/roleService";

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId) => {
      const response = await deleteRoleApi(roleId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
