import { useQuery } from "@tanstack/react-query";
import { fetchPermissionsApi } from "../../services/permissionsService";

export const usePermissions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await fetchPermissionsApi();
      return response;
    },
  });
  return { permissions: data || [], isLoading };
};
