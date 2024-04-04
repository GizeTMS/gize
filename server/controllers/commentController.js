const expressAsyncHandler = require('express-async-handler');
const db = require('../models');

// Access the models using the "db" object
const Comment = db.Comment;


// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, created_at } = req.body;

    // Check if required fields are provided
    if (!content || !created_at) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      created_at,
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    return res.json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    return res.json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a comment by ID
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    // Check if the comment exists
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Update the comment
    comment.content = content;
    await comment.save();

    return res.json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if the comment exists
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Delete the comment
    await comment.destroy();

    return res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};