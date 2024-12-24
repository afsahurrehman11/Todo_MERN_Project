const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Apply auth middleware to all routes
router.use(auth);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    // Validate required fields
    if (!name || !description || !dueDate) {
      return res.status(400).json({ 
        message: 'Please provide name, description, and due date' 
      });
    }

    const task = new Task({
      name,
      description,
      dueDate,
      userId: req.user.userId
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { name, description, dueDate, status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, description, dueDate, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;