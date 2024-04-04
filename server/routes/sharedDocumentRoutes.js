const express = require('express');
const router = express.Router();
const documentController = require('../controllers/sharedDocumentController');

// Send a message
router.post('/route', (req, res) => {
    // Your code here
router.post('/document', documentController.sendMessage);

// Get document between two users
router.get('/document', documentController.getdocument);
router.get('/document/:messageId', documentController.getMessageById);
router.post('/document', documentController.createMessage);
router.put('/document/:messageId', documentController.updateMessage);
router.delete('/document/:messageId', documentController.deleteMessage);
});

module.exports = router;