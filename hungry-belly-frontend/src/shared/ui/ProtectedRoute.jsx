import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../features/auth/context/auth-context";
import Spinner from "./Spinner";

const ProtectedRoute = () => {
  const { user, isAuthLoading } = useContext(AuthContext);
  const location = useLocation();
  const isAccessDeniedRoute = location.pathname === "/access-denied";

  if (isAccessDeniedRoute) {
    return <Outlet />;
  }

  if (isAuthLoading) {
    return <Spinner message="Checking authentication..."></Spinner>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
