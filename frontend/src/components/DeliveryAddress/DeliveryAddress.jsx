import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryAddress } from '../../context/DeliveryAddressContext';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes, FaCheck, FaMapMarkerAlt, FaUser, FaCity, FaBuilding } from 'react-icons/fa';
import './DeliveryAddress.css';

const DeliveryAddress = ({ isModal, onClose, onSelect, selectedId }) => {
  const navigate = useNavigate();
  const { 
    addresses, 
    loading, 
    error: contextError, 
    fetchAddresses, 
    addAddress,
    updateAddress,
    deleteAddress 
  } = useDeliveryAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    detail: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError('');
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.detail.trim()) return 'Address detail is required';
    if (!form.kelurahan.trim()) return 'Kelurahan is required';
    if (!form.kecamatan.trim()) return 'Kecamatan is required';
    if (!form.kabupaten.trim()) return 'Kabupaten is required';
    if (!form.provinsi.trim()) return 'Provinsi is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      let savedAddress;
      if (editingId) {
        savedAddress = await updateAddress(editingId, form);
      } else {
        savedAddress = await addAddress(form);
      }
      resetForm();
      setShowForm(false);
      await fetchAddresses();
      
      if (isModal && onSelect) {
        onSelect(savedAddress);
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setForm({
      name: address.name,
      detail: address.detail,
      kelurahan: address.kelurahan,
      kecamatan: address.kecamatan,
      kabupaten: address.kabupaten,
      provinsi: address.provinsi
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    try {
      await deleteAddress(id);
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      detail: '',
      kelurahan: '',
      kecamatan: '',
      kabupaten: '',
      provinsi: ''
    });
    setEditingId(null);
    setFormError('');
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleBack = () => {
    if (isModal) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const renderForm = () => (
    <div className="address-form-container">
      <div className="form-header">
        <h2>
          {editingId ? (
            <>
              <FaEdit /> Edit Address
            </>
          ) : (
            <>
              <FaPlus /> Add New Address
            </>
          )}
        </h2>
        <button className="close-form-button" onClick={handleCancel}>
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label>
            <span className="label-icon"><FaUser /></span>
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter recipient name"
          />
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon"><FaMapMarkerAlt /></span>
            <span className="label-text">Address Detail</span>
          </label>
          <textarea
            name="detail"
            value={form.detail}
            onChange={handleInputChange}
            placeholder="Enter complete address details"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="label-icon"><FaBuilding /></span>
              <span className="label-text">Kelurahan</span>
            </label>
            <input
              type="text"
              name="kelurahan"
              value={form.kelurahan}
              onChange={handleInputChange}
              placeholder="Enter kelurahan"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon"><FaBuilding /></span>
              <span className="label-text">Kecamatan</span>
            </label>
            <input
              type="text"
              name="kecamatan"
              value={form.kecamatan}
              onChange={handleInputChange}
              placeholder="Enter kecamatan"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <span className="label-icon"><FaCity /></span>
              <span className="label-text">Kabupaten</span>
            </label>
            <input
              type="text"
              name="kabupaten"
              value={form.kabupaten}
              onChange={handleInputChange}
              placeholder="Enter kabupaten"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon"><FaCity /></span>
              <span className="label-text">Provinsi</span>
            </label>
            <input
              type="text"
              name="provinsi"
              value={form.provinsi}
              onChange={handleInputChange}
              placeholder="Enter provinsi"
            />
          </div>
        </div>

        {formError && <div className="form-error">{formError}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Saving...' : (
              <>
                <FaCheck /> {editingId ? 'Update Address' : 'Save Address'}
              </>
            )}
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderAddresses = () => (
    <div className="addresses-container">
      <div className="addresses-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        <h1>My Addresses</h1>
        <button className="add-address-button" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Address
        </button>
      </div>

      {contextError && <div className="error-message">{contextError}</div>}

      {loading ? (
        <div className="loading">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="no-addresses">
          <FaMapMarkerAlt />
          <p>No addresses found</p>
          <button onClick={() => setShowForm(true)} className="add-first-address">
            <FaPlus /> Add Your First Address
          </button>
        </div>
      ) : (
        <div className="address-cards">
          {addresses.map((address) => (
            <div 
              key={address._id} 
              className={`address-card ${selectedId === address._id ? 'selected' : ''}`}
              onClick={() => isModal && onSelect && onSelect(address)}
            >
              <div className="address-card-header">
                <FaMapMarkerAlt className="location-icon" />
                <h3>{address.name}</h3>
              </div>
              <div className="address-card-content">
                <p className="address-detail">{address.detail}</p>
                <div className="address-meta">
                  <span>{address.kelurahan}</span>
                  <span>{address.kecamatan}</span>
                  <span>{address.kabupaten}</span>
                  <span>{address.provinsi}</span>
                </div>
              </div>
              <div className="address-card-actions">
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(address);
                }} className="edit-button">
                  <FaEdit /> Edit
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(address._id);
                }} className="delete-button">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`delivery-address-container ${isModal ? 'modal' : ''}`}>
      {showForm ? renderForm() : renderAddresses()}
    </div>
  );
};

export default DeliveryAddress;
