const expressAsyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');

exports.getAllTasks = expressAsyncHandler(async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving tasks',
      error: error.message
    });
  }
});

exports.getTaskById = expressAsyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      res.json(task);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving the task',
      error: error.message
    });
  }
});

exports.createTask = expressAsyncHandler(async (req, res) => {
  const requiredFields = [
    'taskID',
    'taskName',
    'description',
    'startDate',
    'endDate',
    'status',
    'assignedUser',
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `${missingFields.join(', ')} cannot be empty`,
    });
    return;
  }

  try {
    const { taskID, taskName, description, startDate, endDate, status, assignedUser } = req.body;

    const task = await Task.create({
      taskID,
      taskName,
      description,
      startDate,
      endDate,
      status,
      assignedUser,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while creating the task',
      error: error.message
    });
  }
});

exports.updateTask = expressAsyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskName, description, startDate, endDate, status, assignedUser } = req.body;
    const task = await Task.findByPk(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      task.taskName = taskName;
      task.description = description;
      task.startDate = startDate;
      task.endDate = endDate;
      task.status = status;
      task.assignedUser = assignedUser;
      await task.save();
      res.json(task);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating the task',
      error: error.message
    });
  }
});

exports.deleteTask = expressAsyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    } else {
      await task.destroy();
      res.json({ message: 'Task deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while deleting the task',
      error: error.message
    });
  }
});