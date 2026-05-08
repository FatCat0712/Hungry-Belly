import FoodForm from "../components/FoodForm";

export default function CreateFood() {
  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Foods</small>
        <h1 className="h3 mb-1 text-center">Create Food</h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <FoodForm selectedFood={null} />
        </div>
      </div>
    </div>
  );
}
