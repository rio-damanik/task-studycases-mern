const User = require('./model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const me = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 1,
                message: 'You are not logged in or token expired'
            });
        }

        const user = await User.findById(req.user._id).select('-password -token');
        return res.json(user);
    } catch (err) {
        next(err);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const { full_name, email, current_password, new_password } = req.body;
        
        // Check if user exists
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({
                error: 1,
                message: 'User not found'
            });
        }

        // Initialize update object
        const updateData = {};

        // Handle name update
        if (full_name) {
            if (full_name.length < 2) {
                return res.status(400).json({
                    error: 1,
                    message: 'Name must be at least 2 characters long'
                });
            }
            updateData.full_name = full_name;
        }

        // Handle email update
        if (email && email !== user.email) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 1,
                    message: 'Invalid email format'
                });
            }

            // Check if email is already in use
            const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
            if (emailExists) {
                return res.status(400).json({
                    error: 1,
                    message: 'Email already in use'
                });
            }
            updateData.email = email;
        }

        // Handle password update
        if (new_password) {
            // Require current password
            if (!current_password) {
                return res.status(400).json({
                    error: 1,
                    message: 'Current password is required to change password'
                });
            }

            // Validate current password
            const isPasswordValid = await bcrypt.compare(current_password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    error: 1,
                    message: 'Current password is incorrect'
                });
            }

            // Validate new password
            if (new_password.length < 6) {
                return res.status(400).json({
                    error: 1,
                    message: 'New password must be at least 6 characters long'
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(new_password, salt);
        }

        // If no updates provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 1,
                message: 'No updates provided'
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -token');

        // Generate new token if email was updated
        let token = null;
        if (updateData.email) {
            token = jwt.sign(updatedUser.toJSON(), config.secretkey);
        }

        return res.json({
            message: 'Profile updated successfully',
            user: updatedUser,
            token: token // Will be null if email wasn't updated
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

module.exports = {
    me,
    updateProfile
};
