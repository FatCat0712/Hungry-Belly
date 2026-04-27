import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "../shared/layouts/AdminLayout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "../shared/ui/ProtectedRoute";
import AccessDenied from "../features/access/pages/AccessDenied";
import Login from "../features/auth/pages/Login";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";
import Orders from "../features/orders/pages/Orders";
import EditRestaurant from "../features/restaurants/pages/EditRestaurant";
import RestaurantDetails from "../features/restaurants/pages/RestaurantDetails";
import RestaurantManagement from "../features/restaurants/pages/RestaurantManagement";
import CreateRole from "../features/roles/pages/CreateRole";
import EditRole from "../features/roles/pages/EditRole";
import RoleManagement from "../features/roles/pages/RoleManagement";
import CreaterUser from "../features/users/pages/CreaterUser";
import EditUser from "../features/users/pages/EditUser";
import ResetUserPassword from "../features/users/pages/ResetUserPassword";
import UserAccountUpdate from "../features/users/pages/UserAccountUpdate";
import UserManagement from "../features/users/pages/UserManagement";
import CreateRestaurant from "../features/restaurants/pages/CreateRestaurant";
import CategoryManagement from "../features/categories/pages/CategoryManagement";
import EditCategory from "../features/categories/pages/EditCategory";
import NewCategory from "../features/categories/pages/NewCategory";
import CreateFood from "../features/foods/pages/CreateFood";
import FoodDetails from "../features/foods/pages/FoodDetails";
import EditFood from "../features/foods/pages/EditFood";
import FoodManagement from "../features/foods/pages/FoodManagement";

function App() {
  return (
    <>
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
              <Route path="restaurants" element={<RestaurantManagement />} />
              <Route path="restaurants/new" element={<CreateRestaurant />} />
              <Route path="restaurants/:id" element={<RestaurantDetails />} />
              <Route path="restaurants/:id/edit" element={<EditRestaurant />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="categories/:id/edit" element={<EditCategory />} />
              <Route path="categories/new" element={<NewCategory />} />
              <Route path="foods" element={<FoodManagement />} />
              <Route path="foods/new" element={<CreateFood />} />
              <Route path="foods/:id" element={<FoodDetails />} />
              <Route path="foods/:id/edit" element={<EditFood />} />
              <Route path="orders" element={<Orders />} />
              <Route path="access-denied" element={<AccessDenied />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
