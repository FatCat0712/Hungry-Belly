import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ListFood.css";
import { deleteFood, getFoodList } from "../../services/foodService";

const ListFood = () => {
  const [list, setList] = useState([]);

  const fetchFoodList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error("Error while fetching the foods.");
    }
  };

  const removeFood = async (id) => {
    try {
      const isDeleted = await deleteFood(id);
      if (isDeleted) {
        toast.success("Food removed.");
        await fetchFoodList();
      } else {
        toast.error("Error occurred while removing food.");
      }
    } catch (error) {
      toast.error("Error occurred while removing food.");
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((food) => (
              <tr key={food.id}>
                <td>
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="img-fluid"
                    width="60"
                    height="60"
                  />
                </td>
                <td>{food.name}</td>
                <td>{food.category.replaceAll("-", " ")}</td>
                <td>${food.price}</td>
                <td className="text-danger">
                  <i
                    className="bi bi-x-circle-fill"
                    onClick={() => removeFood(food.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListFood;
