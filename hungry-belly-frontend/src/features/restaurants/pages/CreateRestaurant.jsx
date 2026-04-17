import React, { useContext } from "react";
import { AuthContext } from "../../auth/context/auth-context";
import RestaurantForm from "../components/RestaurantForm";

export default function CreateRestaurant() {
  const { user: loggedInUser } = useContext(AuthContext);

  if (loggedInUser?.roles.includes("ROLE_ADMIN") === false) {
    return <AccessDenied />;
  }

  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">
          Admin / Restaurants
        </small>
        <h1 className="h3 mb-1 text-center">Create Restaurant</h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <RestaurantForm selectedRestaurant={null} />
        </div>
      </div>
    </div>
  );
}
