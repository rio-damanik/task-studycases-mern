import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      setFormData(prevState => ({
        ...prevState,
        full_name: userData.full_name,
        email: userData.email
      }));
      setInitialData({
        full_name: userData.full_name,
        email: userData.email
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear errors when user starts typing
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    // Check if any changes were made
    if (
      formData.full_name === initialData?.full_name &&
      formData.email === initialData?.email &&
      !formData.new_password
    ) {
      setError('No changes made to update');
      return false;
    }

    // Validate name
    if (formData.full_name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate passwords if changing password
    if (formData.new_password) {
      if (formData.new_password.length < 6) {
        setError('New password must be at least 6 characters long');
        return false;
      }
      if (formData.new_password !== formData.confirm_password) {
        setError('New passwords do not match');
        return false;
      }
      if (!formData.current_password) {
        setError('Current password is required to change password');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        full_name: formData.full_name,
        email: formData.email
      };

      if (formData.new_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }

      const response = await axios.put(
        'http://localhost:8000/api/users/profile',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.error) {
        setError(response.data.message);
      } else {
        setSuccess('Profile updated successfully');
        // Update token if email was changed
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        // Update initial data
        setInitialData({
          full_name: response.data.user.full_name,
          email: response.data.user.email
        });
        // Clear password fields
        setFormData(prevState => ({
          ...prevState,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
      <h2><FaUser className="header-icon" /> Edit Profile</h2>
      {error && (
        <div className="error-message">
          <FaTimes className="message-icon" /> {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          <FaCheck className="message-icon" /> {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="full_name">
            <FaUser className="input-icon" /> Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
            minLength="2"
            maxLength="100"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope className="input-icon" /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="password-section">
          <h3><FaLock className="section-icon" /> Change Password</h3>
          <p className="password-note">Leave password fields empty if you don't want to change it</p>

          <div className="form-group">
            <label htmlFor="current_password">
              <FaLock className="input-icon" /> Current Password
            </label>
            <input
              type="password"
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password">
              <FaLock className="input-icon" /> New Password
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleInputChange}
              minLength="6"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">
              <FaLock className="input-icon" /> Confirm New Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              minLength="6"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
