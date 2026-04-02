import { useQuery } from "@tanstack/react-query";
import { fetchRolesApi } from "../../services/roleService";

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
