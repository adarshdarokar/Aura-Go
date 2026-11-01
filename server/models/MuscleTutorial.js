
const mongoose = require("mongoose");

const muscleGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],

    video: {
      url: {
        type: String,
        default: "",
        trim: true,
      },

      duration: {
        type: Number,
        default: 0,
      },

      thumbnail: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  { _id: true }
);

const muscleTutorialSchema = new mongoose.Schema(
  {
    muscle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    groups: {
      type: [muscleGroupSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "MuscleTutorial",
  muscleTutorialSchema
);
