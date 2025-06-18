const Member = require('../model/profileModel');
const bcrypt = require('bcryptjs');

// Update member name
const updateName = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { firstName, lastName } = req.body;

        const updatedMember = await Member.updateName(memberId, firstName, lastName);

        res.status(200).json({
            success: true,
            data: updatedMember
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update member email with password verification
const updateEmail = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { email, password } = req.body;

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Check if email already exists
        const emailExists = await Member.emailExists(email, memberId);
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use by another account'
            });
        }

        // Verify password
        const isPasswordValid = await Member.verifyPassword(memberId, password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Update email
        const updatedMember = await Member.updateEmail(memberId, email);

        res.status(200).json({
            success: true,
            data: updatedMember
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update member phone with password verification
const updatePhone = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { phoneNumber, password } = req.body;

        // Validate phone number format (basic validation)
        if (!/^\+?[\d\s-]{10,}$/.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid phone number'
            });
        }

        // Check if phone already exists
        const phoneExists = await Member.phoneExists(phoneNumber, memberId);
        if (phoneExists) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already in use by another account'
            });
        }

        // Verify password
        const isPasswordValid = await Member.verifyPassword(memberId, password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Update phone
        const updatedMember = await Member.updatePhone(memberId, phoneNumber);

        res.status(200).json({
            success: true,
            data: updatedMember
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updatePassword= async (req, res) => {
    try {
      const { memberId } = req.params;
      const { currentPassword, newPassword } = req.body;
  
      // Validate password length
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters'
        });
      }
  
      await Member.updatePassword(memberId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

module.exports= {
    updateName,
    updateEmail,
    updatePhone,
    updatePassword
};