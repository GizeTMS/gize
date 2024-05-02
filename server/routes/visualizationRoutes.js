const express = require('express');
const router = express.Router();

const visualizationController = require('../controllers/visualizationController');

// Define routes for visualization resource
router.post('/', visualizationController.createVisualization);
router.get('/', visualizationController.getAllVisualizations);
router.get('/:id', visualizationController.getVisualizationById);
router.put('/:id', visualizationController.updateVisualizationById);
router.delete('/:id', visualizationController.deleteVisualizationById);

module.exports = router;