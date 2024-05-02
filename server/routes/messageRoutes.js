const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Send a message
router.post('/route', (req, res) => {
router.post('/messages', messageController.sendMessage);
router.get('/messages', messageController.getMessages);
router.get('/messages/:messageId', messageController.getMessageById);
router.post('/messages', messageController.createMessage);
router.put('/messages/:messageId', messageController.updateMessage);
router.delete('/messages/:messageId', messageController.deleteMessage);
});

module.exports = router;