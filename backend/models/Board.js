const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

boardSchema.index({ ownerId: 1 });
boardSchema.index({ members: 1 });

module.exports = mongoose.model("Board", boardSchema);
