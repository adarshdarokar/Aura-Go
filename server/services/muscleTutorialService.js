
const mongoose = require("mongoose");
const MuscleTutorial = require("../models/MuscleTutorial");

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getAllMuscleTutorials = async () => {
  return MuscleTutorial.find({ isActive: true })
    .populate({
      path: "groups.exercises",
      select: "name slug primaryMuscles thumbnail",
    })
    .sort({ muscle: 1 });
};

const getMuscleTutorialByName = async (muscle) => {
  if (!muscle || typeof muscle !== "string") {
    throw createError("Valid muscle name is required");
  }

  const tutorial = await MuscleTutorial.findOne({
    muscle: muscle.trim().toLowerCase(),
    isActive: true,
  }).populate({
    path: "groups.exercises",
    select: "name slug primaryMuscles thumbnail",
  });

  if (!tutorial) {
    throw createError("Muscle tutorial not found", 404);
  }

  return tutorial;
};

module.exports = {
  getAllMuscleTutorials,
  getMuscleTutorialByName,
};
