const express = require('express');
const userRouter = express.Router();

const userController = require('../controller/userController.js');

// Define routes for bills resource
userRouter.post('/', userController.create);
userRouter.post('/login', userController.login);
userRouter.post('/requestPasswordReset', userController.requestPasswordReset);
userRouter.post('/verifyResetToken', UserController.verifyResetToken)
userRouter.post('/updatePasswordWithToken', userController.updatePasswordWithToken);
userRouter.get('/', userController.findAll);
userRouter.get('/:id', userController.findOne);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

module.exports = userRouter;
