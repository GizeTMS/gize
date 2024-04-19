const asyncHandler = require('express-async-handler');
const db = require('../models');
const message = db.Message;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Project = db.Project;

exports.create = asyncHandler(async (req, res) => {
    // Validate request
    const requiredFields = [
      'ProjectID',
      'ProjectName',
      'Description',
      'StartDate',
    ];
  
    const missingFields = requiredFields.filter((field) => !req.body[field]);
  
    if (missingFields.length > 0) {
      res.status(400).json({
        message: `${missingFields.join(', ')} cannot be empty`,
      });
      return;
    }
  
  
    // Check if project already exists
    const existingProject = await Project.findOne({
      where: {
        ProjectID: req.body.ProjectID,
      },
    });
  
    if (existingProject) {
      res.status(409).send({
        message: 'Project already exists',
      });
      return;
    }
  
    // Create a project object
    const project = {
      ProjectID: req.body.ProjectID,
      ProjectName: req.body.ProjectName,
      Description: req.body.Description,
      StartDate: req.body.StartDate,
      EndDate: req.body.EndDate,
      Status: req.body.Status || 'Active',
    };
  
    // Save project in the database
    const data = await Project.create(project);
    res.send(data);
  });
  
  // Retrieve all projects from the database
  exports.findAll = asyncHandler(async (req, res) => {
    const data = await Project.findAll();
    res.send(data);
  });
  
  // Find a single project by id
  exports.findOne = asyncHandler(async (req, res) => {
    const id = req.params.id;
  
    const data = await Project.findByPk(id);
    if (!data) {
      res.status(404).send({
        message: `Project with id=${id} not found`,
      });
    } else {
      res.send(data);
    }
  });
  
  // Update a project by id
  exports.update = asyncHandler(async (req, res) => {
    const id = req.params.id;
  
    const [num] = await Project.update(req.body, {
      where: { id: id },
    });
  
    if (num === 1) {
      res.send({
        message: 'Project was updated successfully.',
      });
    } else {
      res.send({
        message: `Cannot update project with id=${id}. Project not found or req.body is empty!`,
      });
    }
  });
  
  // Delete a project by id
  exports.delete = asyncHandler(async (req, res) => {
    const id = req.params.id;
  
    const num = await Project.destroy({
      where: { id: id },
    });
  
    if (num === 1) {
      res.send({
        message: 'Project was deleted successfully!',
      });
    } else {
      res.send({
        message: `Cannot delete project with id=${id}. Project not found!`,
      });
    }
  });