import { useParams } from "react-router-dom";
import FoodForm from "../components/FoodForm";
import { useGetFoodById } from "../hooks/useFood";
import Spinner from "../../../shared/ui/Spinner";

export default function EditFood() {
  const { id } = useParams();
  const { food, isLoading } = useGetFoodById(id);

  if (isLoading) {
    return <Spinner message="Loading food info..." />;
  }

  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Foods</small>
        <h1 className="h3 mb-1 text-center">Edit Food</h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <FoodForm selectedFood={food} />
        </div>
      </div>
    </div>
  );
}
