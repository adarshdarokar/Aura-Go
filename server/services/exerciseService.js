const Exercise = require("../models/Exercise");

/* ---------- Get All Exercises ---------- */

const getExercises = async ({
    difficulty,
    category,
    muscle
} = {}) => {
    const filter = {
        isActive: true,
        variationOf: null
    };

    if (difficulty) {
        filter.difficulty = difficulty;
    }

    if (category) {
        filter.category = category;
    }

    if (muscle) {
        filter.$or = [
            {
                primaryMuscles: muscle
            },
            {
                secondaryMuscles: muscle
            }
        ];
    }

    const exercises = await Exercise.find(filter)
        .sort({ name: 1 })
        .select(
            "name slug description primaryMuscles equipment difficulty category thumbnail"
        );

    return exercises;
};


/* ---------- Get Exercise Details ---------- */

const getExerciseById = async (exerciseId) => {
    const exercise = await Exercise.findOne({
        _id: exerciseId,
        isActive: true
    });

    if (!exercise) {
        const error = new Error("Exercise not found");
        error.statusCode = 404;
        throw error;
    }

    return exercise;
};


/* ---------- Get Exercise Variations ---------- */

const getExerciseVariations = async (exerciseId) => {
    const parentExercise = await Exercise.findOne({
        _id: exerciseId,
        isActive: true,
        variationOf: null
    });

    if (!parentExercise) {
        const error = new Error("Exercise not found");
        error.statusCode = 404;
        throw error;
    }

    const variations = await Exercise.find({
        variationOf: exerciseId,
        isActive: true
    })
        .sort({ name: 1 })
        .select(
            "name slug description primaryMuscles equipment difficulty category thumbnail video"
        );

    return variations;
};


module.exports = {
    getExercises,
    getExerciseById,
    getExerciseVariations
};