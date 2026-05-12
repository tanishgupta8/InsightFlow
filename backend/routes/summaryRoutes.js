const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Summary = require("../models/Summary");

// @desc    Get all summaries for logged-in user
// @route   GET /api/summaries
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.user._id }).populate("fileId", "originalName sizeBytes").sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get summary by ID
// @route   GET /api/summaries/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const summary = await Summary.findOne({ _id: req.params.id, userId: req.user._id }).populate("fileId");
    
    if (summary) {
      res.json(summary);
    } else {
      res.status(404).json({ message: "Summary not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
