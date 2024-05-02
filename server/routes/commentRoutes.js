const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.post('/comments', commentController.createComment);
router.get('/comments', commentController.getAllComments);
router.get('/comments/:commentId', commentController.getCommentById);
router.put('/comments/:commentId', commentController.updateComment);
router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;
