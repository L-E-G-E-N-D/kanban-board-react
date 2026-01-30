const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String, // 'invite', 'info', etc.
            default: 'info',
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId, // Could be BoardId, TaskId, etc.
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
