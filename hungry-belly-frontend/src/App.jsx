import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/user/UserManagement";
import RoleManagement from "./pages/role/RoleManagement";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";
import CreaterUser from "./pages/user/CreaterUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { Edit, Home } from "lucide-react";
import EditUser from "./pages/user/EditUser";
import ResetUserPassword from "./pages/user/ResetUserPassword";
import EditRole from "./pages/role/EditRole";
import CreateRole from "./pages/role/CreateRole";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UserAccountUpdate from "./pages/user/UserAccountUpdate";
import AccessDenied from "./pages/AccessDenied";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/new" element={<CreaterUser />} />
              <Route path="users/:id/edit" element={<EditUser />} />
              <Route path="roles/new" element={<CreateRole />} />
              <Route path="roles/:id/edit" element={<EditRole />} />
              <Route
                path="users/:id/reset-password"
                element={<ResetUserPassword />}
              />
              <Route path="/profile" element={<UserAccountUpdate />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="orders" element={<Orders />} />
              <Route path="access-denied" element={<AccessDenied />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
