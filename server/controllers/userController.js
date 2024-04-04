const expressAsyncHandler = require('express-async-handler');
const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up Multer storage for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profilePictures');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${fileExtension}`);
  }
});

// Multer file filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer upload instance
const upload = multer({ storage, fileFilter });

exports.getAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving users',
      error: error.message
    });
  }
});

exports.getUserById = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving the user',
      error: error.message
    });
  }
});

exports.createUser = expressAsyncHandler(async (req, res) => {
  const requiredFields = [
    'FirstName',
    'LastName',
    'Password',
    'Email',
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `${missingFields.join(', ')} cannot be empty`,
    });
    return;
  }

  try {
    const { FirstName, LastName, Password, Email, Role } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await User.create({
      FirstName,
      LastName,
      Password: hashedPassword,
      Email,
      Role,
      ProfilePicture: null // Set default profile picture to null
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while creating the user',
      error: error.message
    });
  }
});

exports.updateUser = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { FirstName, LastName, Password, Email, Role } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      user.FirstName = FirstName;
      user.LastName = LastName;
      user.Email = Email;
      user.Role = Role;

      if (Password) {
        user.Password = await bcrypt.hash(Password, 10);
      }

      if (req.file) {
        // Handle profile picture update using multer
        user.ProfilePicture = req.file.path;
      }

      await user.save();
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating the user',
      error: error.message
    });
  }
});

exports.deleteUser = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while deleting the user',
      error: error.message
    });
  }
});




// const User = require('../models/userModel');

// // Create and save a new user
// exports.createUser = async (req, res) => {
//   // Validate request
//   const requiredFields = [
//     'FirstName',
//     'LastName',
//     'Email',
//     'Password',
//   ];

//   // Check if any required fields are missing in the request body
//   const missingFields = requiredFields.filter((field) => !req.body[field]);

//   if (missingFields.length > 0) {
//     res.status(400).send({
//       message: `${missingFields.join(', ')} cannot be empty`,
//     });
//     return;
//   }

//   // Check if user already exists
//   const existingUser = await User.findOne({
//     where: {
//       Email: req.body.Email,
//     },
//   });

//   if (existingUser) {
//     res.status(409).send({
//       message: 'User already exists',
//     });
//     return;
//   }

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(req.body.Password, 10);

//   // Create a user object
//   const user = {
//     FirstName: req.body.FirstName,
//     LaststName: req.body.LastName,
//     Password: hashedPassword,
//     Email: req.body.Email,
//     Role: req.body.Role,
//     ProfilePicture: req.file ? req.file.path : null,
   
//   };

//   try {
//     // Save user in the database
//     const createdUser = await User.create(user);

//     // Send the user data as the response
//     res.send(createdUser);
//   } catch (error) {
//     // Handle validation errors
//     if (error.name === 'SequelizeValidationError') {
//       const errors = error.errors.map((err) => err.message);
//       res.status(400).send({
//         message: 'Validation error',
//         errors: errors,
//       });
//     } else {
//       // Handle other errors
//       console.error('Error saving user:', error);
//       res.status(500).send({
//         message: 'Error saving user',
//       });
//     }
//   }
// };


// // Retrieve all users
// exports.findAll = async (req, res) => {
//   try {
//     // Find all users
//     const users = await User.findAll();

//     // Send the users data as the response
//     res.send(users);
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).send({
//       message: 'Error retrieving users',
//     });
//   }
// };

// // Retrieve a user by ID
// exports.findOne = async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     // Find the user by ID
//     const user = await User.findByPk(userId);

//     // If the user is not found, return a 404 error
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Send the user data as the response
//     res.send(user);
//   } catch (error) {
//     console.error('Error finding user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
// // Update a user by id
// exports.update = asyncHandler(async (req, res) => {
//   const id = req.params.id;

//   try {
//     // Find the user by ID
//     const user = await User.findByPk(id);

//     if (!user) {
//       res.status(404).send({
//         message: `User with id=${id} not found`,
//       });
//     } else {
//       // Update the user fields based on the request body
//       user.FullName = req.body.FullName || user.FullName;
//       user.Email = req.body.Email || user.Email;
//       user.Role = req.body.Role || user.Role;

//       // Update the profile picture if provided in the request
//       if (req.file) {
//         user.ProfilePicture = req.file.path;
//       }

//       // Update the password if provided in the request
//       if (req.body.Password) {
//         const hashedPassword = await bcrypt.hash(req.body.Password, 10);
//         user.Password = hashedPassword;
//       }

//       // Save the updated user
//       await user.save();

//       res.send({
//         message: 'User was updated successfully.',
//         user: user,
//       });
//     }
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).send({
//       message: 'Error updating user',
//     });
//   }
// });

// // Delete a user by id
// exports.delete = asyncHandler(async (req, res) => {
//   const id = req.params.id;

//    // Delete the user from the database
//   const num = await User.destroy({
//     where: { id: id },
//   });

//   if (num === 1) {
//     res.send({
//       message: 'User was deleted successfully!',
//     });
//   } else {
//     res.send({
//       message: `Cannot delete user with id=${id}. User not found!`,
//     });
//   }
// });
// // upload image
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'Images')// Set the destination folder for uploaded images
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Set the filename for uploaded images

//   }
// })
// // Handle image upload
// exports.upload = multer({
//   storage: storage,// Set the storage configuration
//   limits: { fileSize: '1000000' },// Limit the file size to 1MB
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif/;
//     const mimeType = fileTypes.test(file.mimetype);// Check if the file mime type is valid
//     const extname = fileTypes.test(path.extname(file.originalname));// Check if the file extension is valid
//     if (mimeType && extname) {// If both mime type and extension are valid
//       return cb(null, true);
//     }
//     cb('provide the proper format');// Reject the file if the format is invalid
//   }
// }).single('ProfilePicture');// Handle a single file with the field name 'ProfilePicture'


// User login
exports.login = async (req, res) => {
  // Validate request
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    res.status(400).send({
      message: 'Email and password are required',
    });
    return;
  }

  try {
    // Find the user by email
    const user = await User.findOne({
      where: {
        Email: Email,
      },
    });

    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (!isPasswordValid) {
      res.status(401).send({
        message: 'Invalid password',
      });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    res.send({
      message: 'Login successful',
      token: token,
      user: user,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({
      message: 'Error during login',
    });
  }
};
// Request password reset
exports.requestPasswordReset = expressAsyncHandler(async (req, res) => {
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
  const message = `Dear ${user.FullName},\n\nWe received a request to reset your password.\n\nTo reset your password, click on the following link:\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nYourApp Team`;

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
exports.verifyResetToken = expressAsyncHandler(async (req, res) => {
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

exports.updatePasswordWithToken = expressAsyncHandler(async (req, res) => {
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