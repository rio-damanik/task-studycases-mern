import React from "react";
import "./Category.css";

const Category = () => {
  const categories = ["Electronics", "Furniture", "Clothing"];

  return (
    <div className="category-container">
      <h2>Product Categories</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
