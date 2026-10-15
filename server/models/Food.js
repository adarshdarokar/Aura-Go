
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        normalizedName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "grains",
                "pulses",
                "dairy",
                "eggs",
                "meat",
                "vegetables",
                "fruits",
                "nuts_seeds",
                "oils_fats",
                "other"
            ]
        },

        servingUnit: {
            type: String,
            enum: ["g", "ml"],
            default: "g",
            required: true
        },

        caloriesPer100g: {
            type: Number,
            required: true,
            min: 0
        },

        proteinPer100g: {
            type: Number,
            required: true,
            min: 0
        },

        carbsPer100g: {
            type: Number,
            required: true,
            min: 0
        },

        fiberPer100g: {
            type: Number,
            required: true,
            min: 0
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

foodSchema.index(
    { normalizedName: 1 },
    { unique: true }
);

foodSchema.index({
    category: 1,
    isActive: 1
});

module.exports = mongoose.model("Food", foodSchema);
