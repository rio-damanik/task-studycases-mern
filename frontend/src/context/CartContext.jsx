import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../config/config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(config.endpoints.carts, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.items) {
        const cartItems = response.data.items.map(item => ({
          product: item.product,
          quantity: item.qty
        }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(config.endpoints.cartAdd, 
        { productId: product._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const currentItem = cart.find(item => item.product._id === productId);
      if (!currentItem) return;

      const difference = quantity - currentItem.quantity;
      
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          await axios.put(config.endpoints.cartAdd, 
            { productId },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
        }
      } else if (difference < 0) {
        for (let i = 0; i > difference; i--) {
          await axios.put(config.endpoints.cartReduce, 
            { productId },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
        }
      }
      
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(config.endpoints.cartRemove, 
        { productId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      setCustomerName('');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      customerName,
      setCustomerName,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalPrice,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
