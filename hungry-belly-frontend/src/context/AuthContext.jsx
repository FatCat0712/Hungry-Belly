import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/authService";
import { AuthContext } from "./auth-context";
import { login, logout } from "../services/authService";

let currentUserRequest = null;

const requestCurrentUserOnce = async () => {
  if (currentUserRequest) {
    return currentUserRequest;
  }

  currentUserRequest = fetchCurrentUser()
    .then((data) => data)
    .finally(() => {
      currentUserRequest = null;
    });

  return currentUserRequest;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const loginUser = async (email, password) => {
    await login(email, password);
    await fetchUser({ force: true });
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  const fetchUser = async ({ force = false } = {}) => {
    if (!force && window.location.pathname === "/login") {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    setIsAuthLoading(true);

    try {
      const data = await requestCurrentUserOnce();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, fetchUser, isAuthLoading, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
