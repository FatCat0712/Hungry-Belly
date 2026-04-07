import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  isAuthLoading: true,
  fetchUser: async () => {},
  setUser: () => {},
});
