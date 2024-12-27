import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Cart from '../components/Cart/Cart';

const MainLayout = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  return (
    <div className="main-layout">
      <Outlet context={{ selectedTag, setSelectedTag }} />
      <Cart />
    </div>
  );
};

export default MainLayout;
