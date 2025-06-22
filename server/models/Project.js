const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    budget: Number,
    category: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bids: [
      {
        freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: Number,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    selectedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "open" },
    submission: {
      type: String, // could be text or file URL
      default: "",
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    feedback: {
      rating: { type: Number, required: true },
      message: { type: String, required: true },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    submission: { type: String, default: "" },
    isSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
