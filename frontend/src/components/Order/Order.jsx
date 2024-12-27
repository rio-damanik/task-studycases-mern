import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useDeliveryAddress } from '../../context/DeliveryAddressContext';
import { FaUtensils, FaMotorcycle, FaMoneyBillWave, FaCreditCard, FaUpload, FaMapMarkerAlt, FaUser, FaTimes } from 'react-icons/fa';
import { config } from '../../config/config';
import { formatRupiah } from '../../utils/formatRupiah';
import './Order.css';

const Order = () => {
  const navigate = useNavigate();
  const { cart, clearCart, customerName } = useCart();
  const { addresses, fetchAddresses } = useDeliveryAddress();
  const [orderType, setOrderType] = useState('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [transferProof, setTransferProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();
  }, [cart, navigate, fetchAddresses]);

  const handleTransferProofChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setTransferProof(file);
      setError('');
    } else {
      setError('Please upload a valid image file');
      e.target.value = '';
    }
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return orderType === 'delivery' ? 10000 : 0;
  };

  const calculateTotal = () => {
    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    return subtotal + deliveryFee;
  };

  const formatPrice = (price) => {
    try {
      return formatRupiah(price);
    } catch (error) {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
  };

  const handlePlaceOrder = async () => {
    if (orderType === 'delivery' && !selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (orderType === 'delivery' && selectedAddress) {
      if (!selectedAddress.kelurahan || !selectedAddress.kecamatan || 
          !selectedAddress.kabupaten || !selectedAddress.provinsi || 
          !selectedAddress.detail) {
        setError('Please complete all delivery address fields');
        return;
      }
    }

    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      setError('');

      if (!cart || cart.length === 0) {
        throw new Error('Cart is empty');
      }

      if (orderType === 'delivery' && !selectedAddress) {
        throw new Error('Please select a delivery address');
      }

      console.log('Cart data:', cart);

      const token = localStorage.getItem('token');
      const orderData = {
        delivery_fee: orderType === 'delivery' ? 10000 : 0,
        metode_payment: paymentMethod,
        delivery_address: orderType === 'delivery' ? selectedAddress._id : null,
        customer_name: customerName || 'Guest Customer',
        cart_items: cart.map(item => {
          console.log('Processing cart item:', item);
          return {
            product: item.product._id || item.product,
            qty: parseInt(item.quantity) || 0
          };
        })
      };

      console.log('Order data:', orderData);

      let response;
      
      if (paymentMethod === 'transfer' && transferProof) {
        const formData = new FormData();
        formData.append('transferProof', transferProof);
        Object.keys(orderData).forEach(key => {
          formData.append(key, typeof orderData[key] === 'object' ? JSON.stringify(orderData[key]) : orderData[key]);
        });
        
        response = await axios.post(config.endpoints.orders, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        response = await axios.post(config.endpoints.orders, orderData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }

      console.log('Response:', response.data);

      if (response.data && !response.data.error) {
        clearCart();
        setShowConfirmation(false);
        navigate(`/invoice/${response.data.data._id}`);
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? Your cart will be cleared.')) {
      clearCart();
      navigate('/');
    }
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>Checkout</h1>
        <button className="cancel-order-button" onClick={handleCancelOrder}>
          <FaTimes /> Cancel Order
        </button>
      </div>

      <div className="order-content">
        <div className="customer-section">
          <h2><FaUser /> Customer Information</h2>
          <div className="customer-info">
            <p className="customer-name">Customer Name: {customerName?customerName:''}</p>
          </div>
        </div>

        <div className="order-section">
          <h2>Order Type</h2>
          <div className="order-type-options">
            <button
              className={`order-type-button ${orderType === 'dine-in' ? 'active' : ''}`}
              onClick={() => setOrderType('dine-in')}
            >
              <FaUtensils /> Dine In
            </button>
            <button
              className={`order-type-button ${orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => setOrderType('delivery')}
            >
              <FaMotorcycle /> Delivery
            </button>
          </div>
        </div>

        {orderType === 'delivery' && (
          <div className="order-section delivery-section">
            <h2><FaMapMarkerAlt /> Delivery Address</h2>
            {selectedAddress ? (
              <div className="selected-address">
                <h3>{selectedAddress.name}</h3>
                <p>{selectedAddress.detail}</p>
                <p>{selectedAddress.kelurahan}, {selectedAddress.kecamatan}</p>
                <p>{selectedAddress.kabupaten}, {selectedAddress.provinsi}</p>
                <button 
                  className="change-address-button"
                  onClick={() => setShowAddressModal(true)}
                >
                  Change Address
                </button>
              </div>
            ) : (
              <div className="no-address-selected">
                <p>No delivery address selected</p>
                <button 
                  className="select-address-button"
                  onClick={() => setShowAddressModal(true)}
                >
                  Select Address
                </button>
              </div>
            )}
          </div>
        )}

        {showAddressModal && (
          <div className="address-modal">
            <div className="address-modal-content">
              <h2>Select Delivery Address</h2>
              <div className="address-list">
                {addresses.map((address) => (
                  <div 
                    key={address._id}
                    className={`address-item ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddressModal(false);
                    }}
                  >
                    <h3>{address.name}</h3>
                    <p>{address.detail}</p>
                    <p>{address.kelurahan}, {address.kecamatan}</p>
                    <p>{address.kabupaten}, {address.provinsi}</p>
                  </div>
                ))}
              </div>
              <button 
                className="close-modal-button"
                onClick={() => setShowAddressModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="order-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <button
              className={`payment-button ${paymentMethod === 'tunai' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('tunai')}
            >
              <FaMoneyBillWave /> Cash
            </button>
            <button
              className={`payment-button ${paymentMethod === 'transfer' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('transfer')}
            >
              <FaCreditCard /> Transfer
            </button>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="transfer-proof-section">
              <h3>Upload Transfer Proof</h3>
              <div className="file-upload">
                <label className="file-upload-label">
                  <FaUpload />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTransferProofChange}
                    required
                  />
                </label>
                {transferProof && <p>File selected: {transferProof.name}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.map((item) => (
              <div key={item.product._id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="subtotal">
              <span>Subtotal ({cart.length} items)</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="delivery-fee">
                <span>Delivery Fee</span>
                <span>{formatPrice(getDeliveryFee())}</span>
              </div>
            )}
            <div className="total">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <button 
          className="place-order-button"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Confirm Your Order</h2>
            <div className="confirmation-content">
              <p>Please review your order details:</p>
              <div className="confirmation-details">
                <p><strong>Customer Name:</strong> {customerName?customerName:''}</p>
                <p><strong>Order Type:</strong> {orderType}</p>
                <p><strong>Payment Method:</strong> {paymentMethod}</p>
                <p><strong>Total Amount:</strong> {formatPrice(calculateTotal())}</p>
              </div>
              <div className="confirmation-actions">
                <button 
                  className="confirm-button"
                  onClick={handleConfirmOrder}
                  disabled={loading}
                >
                  Confirm Order
                </button>
                <button 
                  className="cancel-button"
                  onClick={handleCancelConfirmation}
                  disabled={loading}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
