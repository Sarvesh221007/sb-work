
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');

// GET /api/users/:id – Get freelancer public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email avgRating');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const completedProjects = await Project.find({
      selectedFreelancer: req.params.id,
      isSubmitted: true
    }).select('title submission feedback');

    res.json({ user, completedProjects });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching freelancer profile' });
  }
});

module.exports = router;
