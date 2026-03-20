import { useQuery } from "@tanstack/react-query";
import { fetchUsersApi } from "../../services/userService";

export const useUsers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetchUsersApi();
      return response;
    },
  });
  return { users: data || [], isLoading };
};
