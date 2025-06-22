const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const jwt = require("jsonwebtoken");
// const authMiddleware = require('../middleware/auth');
const User = require("../models/User"); // Make sure user model is imported

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, auth denied" });
  }

  const token = authHeader.split(" ")[1]; // ✅ remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
}

// backend/routes/projects.js
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      client: req.user.id, // ✅ Attach the logged-in user's ID
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ msg: "Server error while creating project" });
  }
});

// In projectRoutes.js

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name")
      .populate("bids.freelancer", "name avgRating")
      .populate("selectedFreelancer", "name")
      .populate("feedback");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

// Place a bid on a project
router.post("/:id/bid", authMiddleware, async (req, res) => {
  try {
    const { amount, message } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (!project.client) {
      return res.status(400).json({ msg: "Project has no client assigned" });
    }

    if (String(project.client) === req.user.id) {
      return res
        .status(400)
        .json({ msg: "You cannot bid on your own project" });
    }

    project.bids.push({
      freelancer: req.user.id,
      amount,
      message,
    });

    await project.save();
    res.status(200).json({ msg: "Bid placed successfully" });
  } catch (err) {
    console.error("Bid Error:", err);
    res.status(500).json({ msg: "Error placing bid" });
  }
});

// Get all projects posted by the logged-in client
router.get("/my", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching projects for user:", req.user.id); // Add this
    const projects = await Project.find({ client: req.user.id })
      .populate("bids.freelancer", "name")
      .populate("selectedFreelancer", "name")
      .populate("feedback");
    console.log("Projects found:", projects); // Add this
    res.json(projects);
  } catch (err) {
    console.error("Fetch error:", err); // Add this
    res.status(500).json({ msg: "Error fetching your projects" });
  }
});

// Select a winning freelancer
router.post("/:id/select", authMiddleware, async (req, res) => {
  const { freelancerId } = req.body;
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.client.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized or project not found" });
    }

    project.selectedFreelancer = freelancerId;
    project.status = "in-progress";

    await project.save();
    res.json({ msg: "Freelancer selected", project });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/:id/submit", authMiddleware, async (req, res) => {
  const { submission } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send("Project not found");

    if (project.selectedFreelancer.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized");
    }

    project.submission = submission;
    project.isSubmitted = true;
    await project.save();

    res.status(200).send({ message: "Submission successful" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Client submits feedback for a completed project
router.post("/:id/feedback", authMiddleware, async (req, res) => {
  const { rating, message } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (!project.isSubmitted) {
      return res.status(400).json({ msg: "Work not submitted yet" });
    }

    project.feedback = { rating, message };
    await project.save();

    res.status(200).json({ msg: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/freelancer/:id", authMiddleware, async (req, res) => {
  try {
    const freelancerId = req.params.id;

    // Find user
    const user = await User.findById(freelancerId).select("-password");
    if (!user || user.role !== "freelancer") {
      return res.status(404).json({ msg: "Freelancer not found" });
    }

    const completedProjects = await Project.find({
      selectedFreelancer: freelancerId,
      isSubmitted: true,
      feedback: { $exists: true, $ne: null },
    });

    const validRatings = completedProjects
      .map((p) => parseInt(p.feedback?.rating))
      .filter((r) => !isNaN(r));

    const totalRating = validRatings.reduce((sum, r) => sum + r, 0);

    const avgRating =
      completedProjects.length > 0
        ? (totalRating / completedProjects.length).toFixed(1)
        : null;

    res.json({
      freelancer: user,
      averageRating: avgRating,
      reviews: completedProjects.map((p) => ({
        title: p.title,
        feedback: p.feedback,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
