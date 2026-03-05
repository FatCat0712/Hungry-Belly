import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/FoodService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);

  const contextValue = {
    foodList,
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
