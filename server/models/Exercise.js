const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        primaryMuscles: [
            {
                type: String,
                trim: true
            }
        ],

        secondaryMuscles: [
            {
                type: String,
                trim: true
            }
        ],

        equipment: [
            {
                type: String,
                trim: true
            }
        ],

        difficulty: {
            type: String,
            enum: [
                "beginner",
                "intermediate",
                "advanced"
            ],
            required: true
        },

        category: {
            type: String,
            enum: [
                "strength",
                "cardio",
                "mobility",
                "stretching"
            ],
            default: "strength"
        },

        instructions: [
            {
                type: String,
                trim: true
            }
        ],

        commonMistakes: [
            {
                type: String,
                trim: true
            }
        ],

        safetyTip: {
            type: String,
            trim: true
        },

        thumbnail: {
            type: String,
            trim: true
        },

        video: {
            url: {
                type: String,
                trim: true
            },

            duration: {
                type: Number,
                default: 0
            },

            thumbnail: {
                type: String,
                trim: true
            }
        },

        variationOf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Exercise",
    exerciseSchema
);