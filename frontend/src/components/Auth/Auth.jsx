import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:8000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data && !response.data.error) {
          const { token, user } = response.data;
          login(token, user);
          // Redirect all users to home page after login
          navigate('/');
        } else {
          setError(response.data.message || 'Login failed. Please check your credentials.');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await axios.post('http://localhost:8000/api/auth/register', {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        if (response.data && !response.data.error) {
          const { token, user } = response.data;
          login(token, user);
          navigate('/');
        } else {
          setError(response.data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p>{isLogin ? 'Sign in to continue' : 'Get started with your account'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>
                <i className="fas fa-user"></i>
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={2}
                maxLength={100}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <i className="fas fa-envelope"></i>
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              <span>Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>
                  <i className="fas fa-lock"></i>
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={6}
                  placeholder="Confirm your password"
                />
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-user-tag"></i>
                  <span>Role</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              className="toggle-auth-button"
              onClick={toggleAuthMode}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
