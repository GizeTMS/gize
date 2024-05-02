const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');

// Define routes for projects resource
router.post('/', projectController.create);
router.get('/', projectController.findAll);
router.get('/:id', projectController.findOne);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

module.exports = router;