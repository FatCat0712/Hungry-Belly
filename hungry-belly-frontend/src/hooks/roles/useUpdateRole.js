import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoleApi } from "../../services/roleService";

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, roleData }) => {
      const response = await updateRoleApi(roleId, roleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
