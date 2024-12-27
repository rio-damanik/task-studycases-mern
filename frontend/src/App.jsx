// src/App.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import { DeliveryAddressProvider } from "./context/DeliveryAddressContext";
import "./App.css";

const App = () => {
  return (
    <DeliveryAddressProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
        <Cart />
      </div>
    </DeliveryAddressProvider>
  );
};

export default App;
