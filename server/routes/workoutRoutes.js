const express = require("express");

const {
  createWorkoutController,
  getUserWorkoutsController,
  getWorkoutByIdController,
  updateWorkoutController,
  deleteWorkoutController,
  addExerciseToWorkoutController,
  removeExerciseFromWorkoutController,
} = require("../controllers/workoutController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createWorkoutController);

router.get("/", protect, getUserWorkoutsController);

router.get("/:id", protect, getWorkoutByIdController);

router.patch("/:id", protect, updateWorkoutController);

router.delete("/:id", protect, deleteWorkoutController);
router.post("/:id/exercises", protect, addExerciseToWorkoutController);

router.delete(
  "/:id/exercises/:exerciseId",
  protect,
  removeExerciseFromWorkoutController,
);

module.exports = router;
