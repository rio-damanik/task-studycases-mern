// AppRoutes.jsx

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Cart from "./components/Cart/Cart";
import Category from "./components/Category/Category";
import DeliveryAddress from "./components/DeliveryAddress/DeliveryAddress";
import Invoice from "./components/Invoice/Invoice";
import ProductGrid from "./components/Product/ProductGrid";
import UserProfile from "./components/UserProfile/UserProfile";

function AppRoutes() {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <Routes>
      <Route path="/" element={<ProductGrid />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/category" element={<Category />} />
      <Route path="/delivery-address" element={<DeliveryAddress />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/product" element={<ProductGrid />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}

export default AppRoutes;
