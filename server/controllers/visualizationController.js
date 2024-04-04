const asyncHandler = require('express-async-handler');
const db = require('../models');
const Visualization = db.Visualization;

// Create and save a new visualization
exports.createVisualization = asyncHandler(async (req, res) => {
  // Validate request
  if (!req.body.VisualizationID || !req.body.name || !req.body.description || !req.body.type) {
    res.status(400).send({ message: 'Fields cannot be empty' });
    return;
  }

  // Check if visualization already exists
  const existingVisualization = await Visualization.findOne({
    where: {
      VisualizationID: req.body.VisualizationID,
    },
  });

  if (existingVisualization) {
    res.status(409).send({ message: 'Visualization already exists' });
    return;
  }

  // Create a visualization object
  const visualization = {
    VisualizationID: req.body.VisualizationID,
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    dataSource: req.body.dataSource,
  };

  // Save visualization in the database
  const data = await Visualization.create(visualization);
  res.send(data);
});

// Retrieve all visualizations from the database
exports.getAllVisualizations = asyncHandler(async (req, res) => {
  const data = await Visualization.findAll();
  res.send(data);
});

// Find a single visualization by id
exports.getVisualizationById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = await Visualization.findByPk(id);

  if (!data) {
    res.status(404).send({ message: `Visualization with id=${id} not found` });
  } else {
    res.send(data);
  }
});

// Update a visualization by id
exports.updateVisualizationById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const [num] = await Visualization.update(req.body, {
    where: { VisualizationID: id },
  });

  if (num === 1) {
    res.send({ message: 'Visualization was updated successfully' });
  } else {
    res.send({ message: `Cannot update visualization with id=${id}. Visualization not found or req.body is empty` });
  }
});

// Delete a visualization by id
exports.deleteVisualizationById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const num = await Visualization.destroy({
    where: { VisualizationID: id },
  });

  if (num === 1) {
    res.send({ message: 'Visualization was deleted successfully' });
  } else {
    res.send({ message: `Cannot delete visualization with id=${id}. Visualization not found` });
  }
});