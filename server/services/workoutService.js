const Workout = require("../models/Workout");

const createWorkout = async (userId, workoutData) => {
    const workout = await Workout.create({
        user: userId,
        ...workoutData
    });

    return workout;
};

const getUserWorkouts = async (userId) => {
    const workouts = await Workout.find({
        user: userId
    })
        .populate(
            "exercises.exercise",
            "name slug primaryMuscles equipment difficulty thumbnail"
        )
        .sort({ createdAt: -1 });

    return workouts;
};

const getWorkoutById = async (userId, workoutId) => {
    const workout = await Workout.findOne({
        _id: workoutId,
        user: userId
    }).populate(
        "exercises.exercise",
        "name slug description primaryMuscles secondaryMuscles equipment difficulty thumbnail video"
    );

    if (!workout) {
        const error = new Error("Workout not found");
        error.statusCode = 404;
        throw error;
    }

    return workout;
};

const updateWorkout = async (
    userId,
    workoutId,
    workoutData
) => {
    const workout = await Workout.findOneAndUpdate(
        {
            _id: workoutId,
            user: userId
        },
        workoutData,
        {
            new: true,
            runValidators: true
        }
    ).populate(
        "exercises.exercise",
        "name slug primaryMuscles equipment difficulty thumbnail"
    );

    if (!workout) {
        const error = new Error("Workout not found");
        error.statusCode = 404;
        throw error;
    }

    return workout;
};

const deleteWorkout = async (userId, workoutId) => {
    const workout = await Workout.findOneAndDelete({
        _id: workoutId,
        user: userId
    });

    if (!workout) {
        const error = new Error("Workout not found");
        error.statusCode = 404;
        throw error;
    }

    return workout;
};

const addExerciseToWorkout = async (
    userId,
    workoutId,
    exerciseData
) => {
    const workout = await Workout.findOne({
        _id: workoutId,
        user: userId
    });

    if (!workout) {
        const error = new Error("Workout not found");
        error.statusCode = 404;
        throw error;
    }

    workout.exercises.push(exerciseData);

    await workout.save();

    return workout;
};

const removeExerciseFromWorkout = async (
    userId,
    workoutId,
    exerciseId
) => {
    const workout = await Workout.findOne({
        _id: workoutId,
        user: userId
    });

    if (!workout) {
        const error = new Error("Workout not found");
        error.statusCode = 404;
        throw error;
    }

    const exerciseIndex = workout.exercises.findIndex(
        (item) =>
            item.exercise.toString() === exerciseId
    );

    if (exerciseIndex === -1) {
        const error = new Error(
            "Exercise not found in workout"
        );
        error.statusCode = 404;
        throw error;
    }

    workout.exercises.splice(exerciseIndex, 1);

    await workout.save();

    return workout;
};

module.exports = {
    createWorkout,
    getUserWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout
};