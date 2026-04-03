import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRolesApi,
  fetchRoleWithIdApi,
  updateRoleApi,
} from "../../services/roleService";

// export const useCreateRole = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (roleData) => {
//       const response = await createRoleApi(roleData);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roles"] });
//     },
//   });
// };

export const useRoles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await fetchRolesApi();
      return response;
    },
  });
  return { roles: data || [], isLoading };
};

export const useRole = (roleId) => {
  const { data, isLoading } = useQuery({
    queryKey: ["roles", roleId],
    queryFn: async () => {
      const response = await fetchRoleWithIdApi(roleId);
      return response;
    },
  });
  return { role: data || null, isLoading };
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { data, mutateAsync: updateRole } = useMutation({
    mutationFn: async (roleData) => {
      const response = await updateRoleApi(roleData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return { data, updateRole };
};

// export const useDeleteRole = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (roleId) => {
//       const response = await deleteRoleApi(roleId);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roles"] });
//     },
//   });
// };

// export const usePermissions = () => {
//   const { data, isLoading } = useQuery({
//     queryKey: ["permissions"],
//     queryFn: async () => {
//       const response = await fetchPermissionsApi();
//       return response;
//     },
//   });
//   return { permissions: data || [], isLoading };
// };

// export const useUpdateRole = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ roleId, roleData }) => {
//       const response = await updateRoleApi(roleId, roleData);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roles"] });
//     },
//   });
// };
