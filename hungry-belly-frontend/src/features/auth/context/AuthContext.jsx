import { useEffect, useState } from "react";
import { loginApi, logoutApi } from "../api/authService";
import { AuthContext } from "./auth-context";
import { useFetchCurrentUser } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const isOnLoginPage = () => window.location.pathname === "/login";
  const {
    currentUser,
    isLoading: isCurrentUserLoading,
    refetch,
  } = useFetchCurrentUser({ enabled: !isOnLoginPage() });
  const queryClient = useQueryClient();

  const loginUser = async (email, password) => {
    await loginApi(email, password);
    await fetchUser({ force: true });
  };

  const logoutUser = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setIsAuthLoading(false);
    }
    await queryClient.cancelQueries({ queryKey: ["currentUser"] });
    queryClient.removeQueries({ queryKey: ["currentUser"] });
  };

  const fetchUser = async ({ force = false } = {}) => {
    if (!force && isOnLoginPage()) {
      setUser(null);
      setIsAuthLoading(false);
      return null;
    }

    setIsAuthLoading(true);

    try {
      const result = await refetch();

      if (result.error) {
        setUser(null);
        return null;
      }

      const nextUser = result.data || null;
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    if (isOnLoginPage()) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    setUser(currentUser || null);
    setIsAuthLoading(isCurrentUserLoading);
  }, [currentUser, isCurrentUserLoading]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, fetchUser, isAuthLoading, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
