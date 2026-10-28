
const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateId = (id, label = "ID") => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(`Invalid ${label}`, 400);
  }
};

const validateObject = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Request data must be an object");
  }
};

const validateNumber = (
  value,
  field,
  { min = 0, integer = false } = {}
) => {
  const number = Number(value);

  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    !Number.isFinite(number) ||
    number < min ||
    (integer && !Number.isInteger(number))
  ) {
    throw createError(`Invalid ${field}`);
  }

  return number;
};

const validateWorkoutFields = (data, { creating = false } = {}) => {
  validateObject(data);

  const allowedFields = [
    "name",
    "description",
    "difficulty",
    "estimatedDuration",
    "status",
    "exercises",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      updates[field] = data[field];
    }
  }

  if (creating && !Object.prototype.hasOwnProperty.call(updates, "name")) {
    throw createError("Workout name is required");
  }

  if ("name" in updates) {
    if (typeof updates.name !== "string" || !updates.name.trim()) {
      throw createError("Workout name is required");
    }
    updates.name = updates.name.trim();
  }

  if ("description" in updates && typeof updates.description !== "string") {
    throw createError("Description must be a string");
  }

  if ("difficulty" in updates) {
    if (!["beginner", "intermediate", "advanced"].includes(updates.difficulty)) {
      throw createError("Invalid workout difficulty");
    }
  }

  if ("status" in updates) {
    if (!["draft", "active", "completed"].includes(updates.status)) {
      throw createError("Invalid workout status");
    }
  }

  if ("estimatedDuration" in updates) {
    updates.estimatedDuration = validateNumber(
      updates.estimatedDuration,
      "estimated duration"
    );
  }

  return updates;
};

const validateExerciseEntries = async (entries) => {
  if (!Array.isArray(entries)) {
    throw createError("Exercises must be an array");
  }

  const exerciseIds = [];

  for (const entry of entries) {
    validateObject(entry);

    validateId(entry.exercise, "exercise ID");

    validateNumber(entry.sets, "sets", { min: 1, integer: true });
    validateNumber(entry.reps, "reps", { min: 1, integer: true });
    validateNumber(entry.order, "exercise order", { min: 1, integer: true });

    if ("weight" in entry) {
      validateNumber(entry.weight, "weight");
    }

    if ("restTime" in entry) {
      validateNumber(entry.restTime, "rest time");
    }

    exerciseIds.push(String(entry.exercise));
  }

  const uniqueIds = [...new Set(exerciseIds)];

  if (uniqueIds.length === 0) return;

  const validExercises = await Exercise.find({
    _id: { $in: uniqueIds },
    isActive: { $ne: false },
  }).select("_id");

  if (validExercises.length !== uniqueIds.length) {
    throw createError("One or more exercises are invalid or inactive");
  }
};
 const workoutListPopulate = {
  path: "exercises.exercise",
  select: "name slug primaryMuscles equipment difficulty thumbnail",
};

const workoutDetailPopulate = {
  path: "exercises.exercise",
  select:
    "name slug description primaryMuscles secondaryMuscles equipment difficulty thumbnail video",
};

const createWorkout = async (userId, workoutData) => {
  const data = validateWorkoutFields(workoutData, { creating: true });

  if (data.exercises !== undefined) {
    await validateExerciseEntries(data.exercises);
  }

  // Explicit user assignment prevents clients from choosing another owner.
  const workout = await Workout.create({
    name: data.name,
    user: userId,
    description: data.description,
    difficulty: data.difficulty,
    estimatedDuration: data.estimatedDuration,
    status: data.status,
    exercises: data.exercises,
  });

  return Workout.findById(workout._id).populate(workoutListPopulate);
};

const getUserWorkouts = async (userId) => {
  return Workout.find({ user: userId })
    .populate(workoutListPopulate)
    .sort({ createdAt: -1 });
};

const getWorkoutById = async (userId, workoutId) => {
  validateId(workoutId, "workout ID");

  const workout = await Workout.findOne({
    _id: workoutId,
    user: userId,
  }).populate(workoutDetailPopulate);

  if (!workout) {
    throw createError("Workout not found", 404);
  }

  return workout;
};

const updateWorkout = async (userId, workoutId, workoutData) => {
  validateId(workoutId, "workout ID");

  const updates = validateWorkoutFields(workoutData);

  if (Object.keys(updates).length === 0) {
    throw createError("No valid workout fields provided");
  }

  if (updates.exercises !== undefined) {
    await validateExerciseEntries(updates.exercises);
  }

  const workout = await Workout.findOne({
    _id: workoutId,
    user: userId,
  });

  if (!workout) {
    throw createError("Workout not found", 404);
  }

  // Only validated, allowlisted fields can be changed.
  workout.set(updates);
  await workout.save();

  return Workout.findById(workout._id).populate(workoutListPopulate);
};

const deleteWorkout = async (userId, workoutId) => {
  validateId(workoutId, "workout ID");

  const workout = await Workout.findOneAndDelete({
    _id: workoutId,
    user: userId,
  });

  if (!workout) {
    throw createError("Workout not found", 404);
  }

  return workout;
};

const addExerciseToWorkout = async (userId, workoutId, exerciseData) => {
  validateId(workoutId, "workout ID");
  validateObject(exerciseData);

  await validateExerciseEntries([exerciseData]);

  const workout = await Workout.findOne({
    _id: workoutId,
    user: userId,
  });

  if (!workout) {
    throw createError("Workout not found", 404);
  }

  const alreadyExists = workout.exercises.some(
    (item) => String(item.exercise) === String(exerciseData.exercise)
  );

  // Subdocuments have no IDs, so duplicate references would make deletion ambiguous.
  if (alreadyExists) {
    throw createError("This exercise is already in the workout", 409);
  }

  workout.exercises.push(exerciseData);
  await workout.save();

  return Workout.findById(workout._id).populate(workoutListPopulate);
};

const removeExerciseFromWorkout = async (
  userId,
  workoutId,
  exerciseId
) => {
  validateId(workoutId, "workout ID");
  validateId(exerciseId, "exercise ID");

  const workout = await Workout.findOne({
    _id: workoutId,
    user: userId,
  });

  if (!workout) {
    throw createError("Workout not found", 404);
  }

  const exerciseIndex = workout.exercises.findIndex(
    (item) => String(item.exercise) === String(exerciseId)
  );

  if (exerciseIndex === -1) {
    throw createError("Exercise not found in workout", 404);
  }

  workout.exercises.splice(exerciseIndex, 1);
  await workout.save();

  return Workout.findById(workout._id).populate(workoutListPopulate);
};

module.exports = {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
};
