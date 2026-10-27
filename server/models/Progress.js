const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    weight: {
      type: Number,
      min: 1,
      max: 500,
      default: null,
    },

    bodyMeasurements: {
      chest: { type: Number, min: 0, default: null },
      waist: { type: Number, min: 0, default: null },
      arms: { type: Number, min: 0, default: null },
      shoulders: { type: Number, min: 0, default: null },
      thighs: { type: Number, min: 0, default: null },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Progress", progressSchema);