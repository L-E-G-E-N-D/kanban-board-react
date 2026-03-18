const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

activitySchema.index({ boardId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
