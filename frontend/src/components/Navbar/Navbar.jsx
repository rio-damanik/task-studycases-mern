// src/components/Navbar/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaClipboardList, 
  FaUser, 
  FaSignOutAlt, 
  FaBoxOpen, 
  FaUserCog,
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-link">
          <h1>POS System</h1>
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">
          <FaHome /> Home
        </Link>
        
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin/products" className="navbar-item">
                <FaBoxOpen /> Manage Products
              </Link>
            )}
            <Link to="/order" className="navbar-item">
              <FaClipboardList /> Order
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
            <Link to="/delivery-address" className="navbar-item">
              <FaMapMarkerAlt /> Addresses
            </Link>
            <Link to="/profile" className="navbar-item">
              <FaUserCog /> Profile
            </Link>
            <button onClick={handleLogout} className="navbar-item logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="navbar-item">
            <FaUser /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
