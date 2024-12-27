import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DeliveryAddressContext = createContext();

export const useDeliveryAddress = () => {
  const context = useContext(DeliveryAddressContext);
  if (!context) {
    throw new Error('useDeliveryAddress must be used within a DeliveryAddressProvider');
  }
  return context;
};

export const DeliveryAddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchAddresses = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8000/api/delivery-addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addAddress = async (addressData) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/delivery-addresses',
        addressData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const newAddress = response.data;
      setAddresses(prev => [...prev, newAddress]);
      return newAddress;
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id, addressData) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(
        `http://localhost:8000/api/delivery-addresses/${id}`,
        addressData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const updatedAddress = response.data;
      setAddresses(prev => prev.map(addr => 
        addr._id === id ? updatedAddress : addr
      ));
      if (selectedAddress?._id === id) {
        setSelectedAddress(updatedAddress);
      }
      return updatedAddress;
    } catch (error) {
      console.error('Error updating address:', error);
      setError('Failed to update address');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:8000/api/delivery-addresses/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAddresses(prev => prev.filter(addr => addr._id !== id));
      if (selectedAddress?._id === id) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    addresses,
    selectedAddress,
    setSelectedAddress,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return (
    <DeliveryAddressContext.Provider value={value}>
      {children}
    </DeliveryAddressContext.Provider>
  );
};
