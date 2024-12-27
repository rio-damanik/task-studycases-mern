import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaMotorcycle, FaPrint, FaHome } from 'react-icons/fa';
import { config } from '../../config/config';
import './Invoice.css';

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && !response.data.error) {
          setInvoice(response.data.data || response.data);
        } else {
          throw new Error(response.data.message || 'Invoice not found');
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchInvoice();
    }
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore React functionality
  };

  if (loading) {
    return <div className="loading">Loading invoice...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!invoice) {
    return <div className="error-message">Invoice not found</div>;
  }

  const subtotal = invoice.orderItems?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;
  const total = subtotal + (invoice.delivery_fee || 0);

  return (
    <div className="page-container">
      <div ref={printRef} className={`invoice-container ${invoice.delivery_address ? 'delivery' : 'pickup'}`}>
        <div className="invoice-header">
          <div className="store-info">
            <div className="order-type-icon">
              {invoice.delivery_address ? <FaMotorcycle size={32} /> : <FaUtensils size={32} />}
            </div>
            <h1>Food Store</h1>
            <p className="store-address">Jl. Example Street No. 123</p>
            <p className="store-contact">Tel: (021) 123-4567</p>
          </div>
          
          <div className="invoice-info">
            <p className="invoice-number">Order #{invoice.order_number || orderId}</p>
            <p className="invoice-date">{formatDate(invoice.createdAt)}</p>
          </div>
        </div>

        <div className="invoice-details">
          <div className="customer-info">
            <h3>Customer Details</h3>
            <p className="customer-name">{invoice.customer_name || 'Guest'}</p>
            {invoice.user && (
              <p className="customer-email">{invoice.user.email}</p>
            )}
          </div>

          <div className="order-info">
            <h3>Order Information</h3>
            <p>
              <span className="label">Type:</span>
              <span className="value">{invoice.delivery_address ? 'Delivery' : 'Pickup'}</span>
            </p>
            <p>
              <span className="label">Status:</span>
              <span className="value status-badge">{invoice.status}</span>
            </p>
            <p>
              <span className="label">Payment:</span>
              <span className="value">{invoice.metode_payment === 'transfer' ? 'Bank Transfer' : 'Cash'}</span>
            </p>
          </div>

          {invoice.delivery_address && (
            <div className="delivery-info">
              <h3>Delivery Address</h3>
              <div className="address-details">
                <p>{invoice.delivery_address.detail}</p>
                <p>{invoice.delivery_address.kelurahan}, {invoice.delivery_address.kecamatan}</p>
                <p>{invoice.delivery_address.kabupaten}, {invoice.delivery_address.provinsi}</p>
              </div>
            </div>
          )}
        </div>

        <div className="order-items">
          <h3>Order Items</h3>
          <div className="items-list">
            <div className="items-header">
              <span>Item</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Total</span>
            </div>
            {invoice.orderItems?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-name">{item.name}</div>
                <div className="item-qty">{item.qty}</div>
                <div className="item-price">{formatPrice(item.price)}</div>
                <div className="item-total">{formatPrice(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {invoice.delivery_fee > 0 && (
            <div className="summary-row delivery-fee">
              <span>Delivery Fee</span>
              <span>{formatPrice(invoice.delivery_fee)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="invoice-footer">
          <p className="thank-you">Thank you for your order!</p>
          <p className="footer-note">Please keep this invoice for your records.</p>
        </div>
      </div>

      <div className="invoice-actions">
        <button onClick={handlePrint} className="print-button">
          <FaPrint /> Print Invoice
        </button>
        <button onClick={() => navigate('/')} className="back-button">
          <FaHome /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default Invoice;