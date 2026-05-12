const mongoose = require("mongoose");

const summarySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Nullable for guests
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    summaryText: {
      type: String,
    },
    insights: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Summary = mongoose.model("Summary", summarySchema);

module.exports = Summary;
