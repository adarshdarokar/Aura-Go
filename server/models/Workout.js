const mongoose = require("mongoose");

const workoutExerciseSchema = new mongoose.Schema(
    {
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            required: true
        },

        sets: {
            type: Number,
            required: true,
            min: 1
        },

        reps: {
            type: Number,
            required: true,
            min: 1
        },

        weight: {
            type: Number,
            default: 0,
            min: 0
        },

        restTime: {
            type: Number,
            default: 60,
            min: 0
        },

        order: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        exercises: [workoutExerciseSchema],

        difficulty: {
            type: String,
            enum: [
                "beginner",
                "intermediate",
                "advanced"
            ],
            default: "beginner"
        },

        estimatedDuration: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "draft",
                "active",
                "completed"
            ],
            default: "draft"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Workout",
    workoutSchema
);