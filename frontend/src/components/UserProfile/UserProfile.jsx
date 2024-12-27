import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        login(localStorage.getItem("token"), response.data);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/users/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setSuccess("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="user-profile-container">Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>Profile Settings</h2>
        <p className="user-role">Role: {user.role}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-section">
        <h3>Profile Information</h3>
        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label>
                <i className="fas fa-user"></i>
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={profileData.full_name}
                onChange={handleProfileChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  setProfileData({
                    full_name: user.full_name,
                    email: user.email,
                  });
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">
                <i className="fas fa-user"></i> Full Name:
              </span>
              <span className="info-value">{profileData.full_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">
                <i className="fas fa-envelope"></i> Email:
              </span>
              <span className="info-value">{profileData.email}</span>
            </div>
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Change Password</h3>
        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i>
                <span>Current Password</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-key"></i>
                <span>New Password</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-key"></i>
                <span>Confirm New Password</span>
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            className="change-password-button"
            onClick={() => setIsChangingPassword(true)}
          >
            <i className="fas fa-key"></i> Change Password
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
