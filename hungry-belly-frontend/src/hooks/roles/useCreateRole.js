import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoleApi } from "../../services/roleService";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleData) => {
      const response = await createRoleApi(roleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
