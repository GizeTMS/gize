const asyncHandler = require('express-async-handler');
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('https://587101034562-48rg0utnf5bs3cem5mcmqpftmg9urf9t.apps.googleusercontent.com');

const User = db.User;

// Create and save a new user
exports.create = asyncHandler(async (req, res) => {
  // Validate request
  if (
    !req.body.UserID ||
    !req.body.FirstName ||
    !req.body.LastName ||
    !req.body.Gender ||
    !req.body.UserName ||
    !req.body.Email || 
    !req.body.Password ||
    !req.body.PhoneNumber ||
    !req.body.Address ||
    !req.body.Role
  ) {
    res.status(400).send({
      message: 'Fields cannot be empty',
    });
    return;
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      Email: req.body.Email,
    },
  });

  if (existingUser) {
    res.status(409).send({
      message: 'User already exists',
    });
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(req.body.Password, 10);

  // Create a user object
  const user = {
    UserID: req.body.UserID,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Gender: req.body.Gender,
    UserName: req.body.UserName,
    Password: hashedPassword,
    Email: req.body.Email,
    PhoneNumber: req.body.PhoneNumber,
    Address: req.body.Address,
    Role: req.body.Role,
  };

  // Save user in the database
  const data = await User.create(user);
  res.send(data);
});

// Retrieve all users from the database
exports.findAll = asyncHandler(async (req, res) => {
  const data = await User.findAll();
  res.send(data);
});

// Find a single user by id
exports.findOne = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const data = await User.findByPk(id);
  if (!data) {
    res.status(404).send({
      message: `User with id=${id} not found`,
    });
  } else {    res.send(data);
  }
});

// Update a user by id
exports.update = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const [num] = await User.update(req.body, {
    where: { id: id },
  });

  if (num === 1) {
    res.send({
      message: 'User was updated successfully.',
    });
  } else {
    res.send({
      message: `Cannot update user with id=${id}. User not found or req.body is empty!`,
    });
  }
});

// Delete a user by id
exports.delete = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const num = await User.destroy({
    where: { id: id },
  });

  if (num === 1) {
    res.send({
      message: 'User was deleted successfully!',
    });
  } else {
    res.send({
      message: `Cannot delete user with id=${id}. User not found!`,
    });
  }
});



// User login auth
exports.login = asyncHandler(async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({
      where: { Email },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const passwordMatch = await bcrypt.compare(Password, user.Password);

      if (!passwordMatch) {
        res.status(401).json({ error: 'Incorrect password' });
      } else {
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, {
          expiresIn: '1h',
        });
        res.status(200).json({ message: 'Login successful', token });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to login user', message: error.message });
  }
});

// Request password reset
exports.requestPasswordReset = asyncHandler(async (req, res) => {
  // Validate request
  if (!req.body.Email) {
    res.status(400).send({
      message: 'Email is required',
    });
    return;
  }

  // Check if user exists
  const user = await User.findOne({
    where: {
      Email: req.body.Email,
    },
  });

  if (!user) {
    res.status(404).send({
      message: 'User not found',
    });
    return;
  }

  // Generate a unique reset token
  const resetToken = uuidv4();

  // Save the reset token and its expiration date in the user's record
  user.PasswordResetToken = resetToken;
  user.PasswordResetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
  await user.save();

  // Send password reset email to the user
  const senderEmail = "letinamekonnen6@gmail.com"; // Replace with your email address
  const senderPassword = "makarula1809"; // Replace with your email password
  const recipientEmail = req.body.Email;
  const subject = 'Password Reset Request';
  const resetLink = `http://localhost:3001/Users/UpdatePassword#/${resetToken}`;
  const message = `Dear ${user.FirstName},\n\nWe received a request to reset your password.\n\nTo reset your password, click on the following link:\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nYourApp Team`;

  sendEmail(senderEmail, senderPassword, recipientEmail, subject, message);

  res.send({
    message: 'Password reset email sent',
  });
});

// Function to send an email
async function sendEmail(senderEmail, senderPassword, recipientEmail, subject, message) {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "letinamekonnen6@gmail.com",
        pass: "clnyfngaveyvxucx",
      },
    });

    // Define the email options
    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject,
      text: message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
// Verify reset password token
exports.verifyResetToken = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    // Check if token is valid and not expired
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [db.Sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired token' });
    } else {
      res.status(200).json({ message: 'Token is valid' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify token', message: error.message });
  }
});

exports.updatePasswordWithToken = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Check if email is valid
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.Password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    user.updatedAt = new Date(); // Set updatedAt field
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password', message: error.message });
  }
});