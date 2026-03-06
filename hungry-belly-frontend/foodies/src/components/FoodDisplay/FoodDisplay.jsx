import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, searchText }) => {
  const { foodList } = useContext(StoreContext);

  const filteredFoodList = foodList.filter((food) => {
    const matchesCategory = category === "All" || food.category === category;

    const matchesSearchText = food.name
      .toLowerCase()
      .includes((searchText || "").toLowerCase());
    return matchesCategory && matchesSearchText;
  });

  return (
    <div className="container">
      <div className="row">
        {filteredFoodList.length > 0 ? (
          filteredFoodList.map((food) => <FoodItem key={food.id} food={food} />)
        ) : (
          <div className="text-center mt-4">
            <h4>No food found.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
