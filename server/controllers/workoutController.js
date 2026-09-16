const {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} = require("../services/workoutService");

const createWorkoutController = async (req, res, next) => {
  try {
    const workout = await createWorkout(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Workout created successfully",
      data: {
        workout,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserWorkoutsController = async (req, res, next) => {
  try {
    const workouts = await getUserWorkouts(req.user.id);

    return res.status(200).json({
      success: true,
      data: {
        workouts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getWorkoutByIdController = async (req, res, next) => {
  try {
    const workout = await getWorkoutById(req.user.id, req.params.id);

    return res.status(200).json({
      success: true,
      data: {
        workout,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateWorkoutController = async (req, res, next) => {
  try {
    const workout = await updateWorkout(req.user.id, req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      data: {
        workout,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteWorkoutController = async (req, res, next) => {
  try {
    await deleteWorkout(req.user.id, req.params.id);

    return res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const addExerciseToWorkoutController = async (req, res, next) => {
  try {
    const workout = await addExerciseToWorkout(
      req.user.id,
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Exercise added to workout successfully",
      data: {
        workout,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeExerciseFromWorkoutController = async (req, res, next) => {
  try {
    const workout = await removeExerciseFromWorkout(
      req.user.id,
      req.params.id,
      req.params.exerciseId,
    );

    return res.status(200).json({
      success: true,
      message: "Exercise removed from workout successfully",
      data: {
        workout,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createWorkoutController,
  getUserWorkoutsController,
  getWorkoutByIdController,
  updateWorkoutController,
  deleteWorkoutController,
  addExerciseToWorkoutController,
  removeExerciseFromWorkoutController,
};
