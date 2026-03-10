import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/FoodService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));
  };

  const decreaseQty = (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(0, prev[foodId] - 1),
    }));
  };

  const removeFromCart = (foodId) => {
    setQuantities((quantities) => {
      const updatedQuantities = { ...quantities };
      delete updatedQuantities[foodId];
      return updatedQuantities;
    });
  };

  const contextValue = {
    foodList,
    quantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    token,
    setToken,
  };

  useEffect(() => {
    async function loadData() {
      const foodData = await fetchFoodList();
      setFoodList(foodData);
    }

    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
