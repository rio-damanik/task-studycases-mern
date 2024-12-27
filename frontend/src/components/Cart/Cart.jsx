import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { formatRupiah } from '../../utils/formatRupiah';
import DeliveryAddress from '../DeliveryAddress/DeliveryAddress';
import './Cart.css';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { cart, customerName, setCustomerName, updateQuantity, removeFromCart, clearCart } = useCart();
  const [editedName, setEditedName] = useState(customerName);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' or 'delivery'
  const navigate = useNavigate();

  const toggleCart = () => setIsOpen(!isOpen);

  const handleUpdateQuantity = (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty >= 1) {
      updateQuantity(productId, newQty);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleEditName = () => {
    setEditedName(customerName);
    setIsEditing(true);
  };

  const handleSaveName = () => {
    setCustomerName(editedName);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(customerName);
    setIsEditing(false);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter customer name');
      const customerNameInput = document.getElementById('customerName');
      if (customerNameInput) {
        customerNameInput.focus();
      }
      return;
    }
    if (orderType === 'delivery' && !selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }
    setIsOpen(false); // Close cart drawer before navigation
    setTimeout(() => {
      navigate('/order');
    }, 300); // Wait for drawer close animation to complete
  };

  const formatPrice = (price) => {
    try {
      return formatRupiah(price);
    } catch (error) {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
  };

  return (
    <>
      <button className="cart-toggle" onClick={toggleCart}>
        <FaShoppingCart />
        <span className="cart-badge">{cart.length}</span>
      </button>

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2><FaShoppingCart /> Shopping Cart</h2>
          <div className="cart-actions">
            {cart.length > 0 && (
              <button className="clear-cart-button" onClick={handleClearCart}>
                <FaTrash />
              </button>
            )}
            <button className="close-button" onClick={toggleCart}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <FaShoppingCart />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="customer-info">
                {isEditing ? (
                  <div className="edit-name-form">
                    <label htmlFor="editName" className="customer-label">
                      <FaUser /> Customer Name
                    </label>
                    <div className="edit-name-input-group">
                      <input
                        type="text"
                        id="editName"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Enter customer name"
                        className="customer-name-input"
                        required
                      />
                      <div className="edit-name-actions">
                        <button className="save-name-button" onClick={handleSaveName}>
                          Save
                        </button>
                        <button className="cancel-edit-button" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="customer-name-display">
                    <label className="customer-label">
                      <FaUser /> Customer Name
                    </label>
                    <div className="name-with-edit">
                      <span className="current-name">
                        {customerName || 'Not set'}
                      </span>
                      <button className="edit-name-button" onClick={handleEditName}>
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {cart.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="item-details">
                    <h3 className="item-name">{item.product.name}</h3>
                    <p className="item-price">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.product._id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="item-subtotal">
                    Subtotal: {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="cart-footer">
          <div className="order-type-selector">
            <label>Order Type:</label>
            <div className="order-type-buttons">
              <button
                className={`order-type-button ${orderType === 'dine-in' ? 'active' : ''}`}
                onClick={() => {
                  setOrderType('dine-in');
                  setSelectedAddressId(null);
                }}
              >
                Dine In
              </button>
              <button
                className={`order-type-button ${orderType === 'delivery' ? 'active' : ''}`}
                onClick={() => setOrderType('delivery')}
              >
                Delivery
              </button>
            </div>
          </div>

          <div className="cart-total">
            <span>Total:</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>
          
          {orderType === 'delivery' && (
            <button 
              className="address-button"
              onClick={() => setShowAddressModal(true)}
            >
              {selectedAddressId ? 'Change Address' : 'Add Delivery Address'}
            </button>
          )}

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={
              cart.length === 0 || 
              !customerName.trim() || 
              (orderType === 'delivery' && !selectedAddressId)
            }
          >
            Checkout
          </button>
        </div>

        {showAddressModal && (
          <DeliveryAddress
            isModal={true}
            onClose={() => setShowAddressModal(false)}
            onSelect={(addressId) => {
              setSelectedAddressId(addressId);
              setShowAddressModal(false);
            }}
            selectedId={selectedAddressId}
          />
        )}
      </div>
    </>
  );
};

export default Cart;