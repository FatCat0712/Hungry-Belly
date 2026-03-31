import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/user/UserManagement";
import RoleManagement from "./pages/RoleManagement";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";
import CreaterUser from "./pages/user/CreaterUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { Edit, Home } from "lucide-react";
import EditUser from "./pages/user/EditUser";
import ResetUserPassword from "./pages/user/ResetUserPassword";

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
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Home />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route
              path="users/:id/reset-password"
              element={<ResetUserPassword />}
            />
            <Route path="users/new" element={<CreaterUser />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="restaurants" element={<Restaurants />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
