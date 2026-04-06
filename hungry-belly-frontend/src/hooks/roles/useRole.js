import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoleApi,
  deleteRoleApi,
  fetchRolesApi,
  fetchRoleWithIdApi,
  updateRoleApi,
} from "../../services/roleService";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createRole, isPending: isCreating } = useMutation({
    mutationFn: async (roleData) => {
      const response = await createRoleApi(roleData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return { createRole, isCreating };
};

export const useRoles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await fetchRolesApi();
      return response.data;
    },
  });
  return { roles: data || [], isLoading };
};

export const useRole = (roleId) => {
  const { data, isLoading } = useQuery({
    queryKey: ["roles", roleId],
    queryFn: async () => {
      const response = await fetchRoleWithIdApi(roleId);
      return response.data;
    },
  });
  return { role: data || null, isLoading };
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const {
    data,
    mutateAsync: updateRole,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: async (roleData) => {
      const response = await updateRoleApi(roleData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return { data, updateRole, isPending: isUpdating };
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: async (roleId) => {
      const response = await deleteRoleApi(roleId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
  return { deleteRole };
};
