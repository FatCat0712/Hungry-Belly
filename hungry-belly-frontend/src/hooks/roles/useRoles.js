import { useQuery } from "@tanstack/react-query";
import { fetchRolesApi } from "../../services/roleService";

export const useRoles = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetchRolesApi();
      return response;
    },
  });
  return { roles: data || [], isLoading };
};
