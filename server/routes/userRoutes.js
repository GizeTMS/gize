const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Define routes for bills resource
router.post('/user', (req, res) => {
router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/requestPasswordReset', userController.requestPasswordReset);
router.post('/verifyResetToken', userController.verifyResetToken)
router.post('/updatePasswordWithToken', userController.updatePasswordWithToken);
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
});

module.exports = router;
