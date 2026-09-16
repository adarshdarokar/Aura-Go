const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        mealType: {
            type: String,
            enum: [
                "breakfast",
                "lunch",
                "dinner",
                "snack"
            ],
            required: true
        },

        mealName: {
            type: String,
            required: true,
            trim: true
        },

        calories: {
            type: Number,
            required: true,
            min: 0
        },

        protein: {
            type: Number,
            required: true,
            min: 0
        },

        carbohydrates: {
            type: Number,
            required: true,
            min: 0
        },

        fiber: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Nutrition",
    nutritionSchema
);