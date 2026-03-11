import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/FoodService";

import {
  addToCart,
  getCartData,
  removeQtyFromCart,
} from "../service/CartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));

    await addToCart(foodId, token);
  };

  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(0, prev[foodId] - 1),
    }));

    await removeQtyFromCart(foodId, token);
  };

  const removeFromCart = async (foodId) => {
    setQuantities((quantities) => {
      const updatedQuantities = { ...quantities };
      delete updatedQuantities[foodId];
      return updatedQuantities;
    });
  };

  const loadCartData = async (token) => {
    const items = await getCartData(token);
    setQuantities(items);
  };

  const contextValue = {
    foodList,
    quantities,
    setQuantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    token,
    setToken,
    loadCartData,
  };

  useEffect(() => {
    async function loadData() {
      const foodData = await fetchFoodList();
      setFoodList(foodData);
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
        await loadCartData(token);
      }
    }

    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
