const {
    getExercises,
    getExerciseById,
    getExerciseVariations
} = require("../services/exerciseService");


/* ---------- Get All Exercises ---------- */

const getAllExercises = async (req, res, next) => {
    try {
        const {
            difficulty,
            category,
            muscle
        } = req.query;

        const exercises = await getExercises({
            difficulty,
            category,
            muscle
        });

        return res.status(200).json({
            success: true,
            data: {
                exercises
            }
        });
    } catch (error) {
        next(error);
    }
};


/* ---------- Get Exercise Details ---------- */

const getExerciseDetails = async (req, res, next) => {
    try {
        const exercise = await getExerciseById(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: {
                exercise
            }
        });
    } catch (error) {
        next(error);
    }
};


/* ---------- Get Exercise Variations ---------- */

const getVariations = async (req, res, next) => {
    try {
        const variations = await getExerciseVariations(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: {
                variations
            }
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllExercises,
    getExerciseDetails,
    getVariations
};