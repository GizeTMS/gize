const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// GET /users - Retrieve all users
router.get('/', UserController.getAllUsers);

// GET /users/:userId - Retrieve a specific user by ID
router.get('/:userId', UserController.getUserById);

// POST /users - Create a new user
router.post('/', UserController.createUser);

// PUT /users/:userId - Update a user
router.put('/:userId', UserController.updateUser);

// DELETE /users/:userId - Delete a user
router.delete('/:userId', UserController.deleteUser);

// User login
router.post('/login', UserController.login);

// Request password reset
router.post('/password/reset', UserController.requestPasswordReset);

// Verify reset password token
router.get('/password/reset/:token', UserController.verifyResetToken);

// Update password with token
router.post('/password/reset/:token', UserController.updatePasswordWithToken);

module.exports = router;