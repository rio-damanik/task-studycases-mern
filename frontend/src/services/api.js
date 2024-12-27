// src/services/api.js
import { API_URL } from "./config";

// Auth APIs
// export const login = (credentials) => axios.post(`${API_URL}/auth/login`, credentials);

// Product APIs
export const fetchProducts = async () => {
  console.log('Fetching products from:', `${API_URL}/products`);
  try {
    const response = await fetch(`${API_URL}/products`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: formData, // FormData will automatically set the correct Content-Type
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchTags = async () => {
  try {
    const response = await fetch(`${API_URL}/tags`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Cart APIs
export const getCart = async () => {
  const cartData = localStorage.getItem('cart');
  return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
};

export const addToCart = async (product, quantity = 1) => {
  try {
    const cart = await getCart();
    const existingItem = cart.items.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    cart.total = calculateTotal(cart.items);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const cart = await getCart();
    const item = cart.items.find(item => item.product._id === productId);

    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        cart.items = cart.items.filter(item => item.product._id !== productId);
      }
    }

    cart.total = calculateTotal(cart.items);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const cart = await getCart();
    cart.items = cart.items.filter(item => item.product._id !== productId);
    cart.total = calculateTotal(cart.items);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    localStorage.setItem('cart', JSON.stringify({ items: [], total: 0 }));
    return { items: [], total: 0 };
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Other endpoints follow similarly...
