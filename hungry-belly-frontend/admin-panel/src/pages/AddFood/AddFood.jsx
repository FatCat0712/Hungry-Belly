import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";

const AddFood = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "biryani",
    price: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("food", JSON.stringify(data));
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/foods",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      if (response.status === 200) {
        alert("Food added successfully");
        setData({ name: "", description: "", category: "biryani", price: "" });
        setImage(null);
      }
    } catch (error) {
      console.log("Error", error);
      alert("Error adding food");
    }
  };

  return (
    <div className="mx-2 mt-2">
      <div className="row">
        <div className="card col-md-4">
          <div className="card-body">
            <h2 className="mb-4">Add Food</h2>
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img
                    src={image ? URL.createObjectURL(image) : assets.upload}
                    alt=""
                    width={98}
                  />
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                  onChange={onChangeHandler}
                  value={data.name}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="5"
                  required
                  onChange={onChangeHandler}
                  value={data.description}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  className="form-control"
                  id="category"
                  name="category"
                  required
                  onChange={onChangeHandler}
                  value={data.category}
                >
                  <option value="biryani">Biryani</option>
                  <option value="cake">Cake</option>
                  <option value="burger">Burger</option>
                  <option value="pizza">Pizza</option>
                  <option value="rolls">Rolls</option>
                  <option value="salad">Salad</option>
                  <option value="ice-cream">Ice Cream</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  required
                  onChange={onChangeHandler}
                  value={data.price}
                ></input>
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
