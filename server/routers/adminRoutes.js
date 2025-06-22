const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/admin');
const User = require('../models/User');
const Project = require('../models/Project');


router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}); // optionally exclude self
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ TOGGLE Block/Unblock User
router.patch('/users/:id/toggle', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ msg: 'User status updated', user });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to toggle user status' });
  }
});

// Delete a project
router.delete('/projects/:id', adminMiddleware, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Project deleted' });
});

module.exports = router;
