import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = () => {
  const { foodList } = useContext(StoreContext);

  return (
    <div className="container">
      <div className="row">
        {foodList.length > 0 ? (
          foodList.map((food) => <FoodItem key={food.id} food={food} />)
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
