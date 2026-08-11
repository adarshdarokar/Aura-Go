const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        refreshTokenHash: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: {
                expireAfterSeconds: 0
            }
        }
    },
    {
        timestamps: true
    }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;