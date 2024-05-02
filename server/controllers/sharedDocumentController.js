const expressAsyncHandler = require('express-async-handler');
const db = require('../models');
const message = db.Document;

exports.getAllDocument = expressAsyncHandler(async (req, res) => {
  try {
    const document = await message.findAll();
    res.json(document);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving document',
      error: error.message
    });
  }
});

exports.getDocumentById = expressAsyncHandler(async (req, res) => {
  try {
    const { documentID } = req.params;
    const message = await message.findByPk(documentID);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
    } else {
      res.json(message);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving the message',
      error: error.message
    });
  }
});

exports.createDocument = expressAsyncHandler(async (req, res) => {
  const requiredFields = [
    'documentID',
    'title',
    'content',
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `${missingFields.join(', ')} cannot be empty`,
    });
    return;
  }

  try {
    const { documentID, title, content } = req.body;

    const newDocument = await document.create({
      documentID,
      title,
      content,
    });

    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while creating the message',
      error: error.message
    });
  }
});

exports.updateDocument = expressAsyncHandler(async (req, res) => {
  try {
    const { documentID } = req.params;
    const { title, content } = req.body;
    const documentToUpdate = await message.findByPk(documentID);
    if (!documentToUpdate) {
      res.status(404).json({ message: 'Message not found' });
    } else {
      documentToUpdate.title = title;
      documentToUpdate.content = content;
      documentToUpdate.timeStamp = timeStamp;
      await documentToUpdate.save();
      res.json(documentToUpdate);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating the message',
      error: error.message
    });
  }
});

exports.deleteDocument = expressAsyncHandler(async (req, res) => {
  try {
    const { documentID } = req.params;
    const messageToDelete = await message.findByPk(documentID);
    if (!messageToDelete) {
      res.status(404).json({ message: 'Message not found' });
    } else {
      await messageToDelete.destroy();
      res.json({ message: 'Message deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while deleting the message',
      error: error.message
    });
  }
});