import React from "react";
import CategoryForm from "../components/CategoryForm";
import Spinner from "../../../shared/ui/Spinner";

const NewCategory = () => {
  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">
          Admin / Categories
        </small>
        <h1 className="h3 mb-1 text-center">New Category</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <CategoryForm selectedCategory={null} />
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
