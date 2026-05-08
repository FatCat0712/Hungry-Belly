import React from "react";
import CategoryForm from "../components/CategoryForm";
import { useGetCategoryById } from "../hooks/useCategory";
import { useParams } from "react-router-dom";
import Spinner from "../../../shared/ui/Spinner";

const EditCategory = () => {
  const { id } = useParams();
  const { category, isLoadingCategory } = useGetCategoryById(id); // TODO: Fetch category by ID and pass to form

  if (isLoadingCategory) {
    return <Spinner message="Loading category info" />;
  }

  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">
          Admin / Categories
        </small>
        <h1 className="h3 mb-1 text-center">Edit Category</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <CategoryForm selectedCategory={category} />
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
