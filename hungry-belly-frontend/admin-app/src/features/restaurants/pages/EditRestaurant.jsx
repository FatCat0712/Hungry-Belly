import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../auth/context/auth-context";
import { useGetRestaurantById } from "../hooks/useRestaurant";
import AccessDenied from "../../access/pages/AccessDenied";
import Spinner from "../../../shared/ui/Spinner";
import RestaurantForm from "../components/RestaurantForm";

export default function EditRestaurant() {
  const { user: loggedInUser } = useContext(AuthContext);

  const { id } = useParams();
  const { restaurant, isLoading } = useGetRestaurantById(id);

  if (loggedInUser?.roles.includes("ROLE_ADMIN") === false) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return <Spinner message="Loading restaurant..." />;
  }

  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">
          Admin / Restaurants
        </small>
        <h1 className="h3 mb-1 text-center">Edit Restaurant</h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <RestaurantForm selectedRestaurant={restaurant} />
        </div>
      </div>
    </div>
  );
}
