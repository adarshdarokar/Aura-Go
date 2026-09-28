const {
    createNutrition,
    getUserNutrition,
    getNutritionById,
    updateNutrition,
    deleteNutrition,
    getDailyNutritionSummary
} = require("../services/nutritionService");

const createNutritionController = async (req, res, next) => {
    try {
        const nutrition = await createNutrition(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Nutrition entry created successfully",
            data: { nutrition }
        });
    } catch (error) {
        next(error);
    }
};

const getUserNutritionController = async (req, res, next) => {
    try {
        const nutrition = await getUserNutrition(
            req.user.id,
            req.query.date
        );

        return res.status(200).json({
            success: true,
            data: { nutrition }
        });
    } catch (error) {
        next(error);
    }
};

const getNutritionByIdController = async (req, res, next) => {
    try {
        const nutrition = await getNutritionById(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: { nutrition }
        });
    } catch (error) {
        next(error);
    }
};

const updateNutritionController = async (req, res, next) => {
    try {
        const nutrition = await updateNutrition(
            req.user.id,
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Nutrition entry updated successfully",
            data: { nutrition }
        });
    } catch (error) {
        next(error);
    }
};

const deleteNutritionController = async (req, res, next) => {
    try {
        await deleteNutrition(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Nutrition entry deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

/* ---------- Daily Nutrition Summary ---------- */

const getDailyNutritionSummaryController = async (
    req,
    res,
    next
) => {
    try {
        const summary = await getDailyNutritionSummary(
            req.user.id,
            req.query.date
        );

        return res.status(200).json({
            success: true,
            data: { summary }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNutritionController,
    getUserNutritionController,
    getNutritionByIdController,
    updateNutritionController,
    deleteNutritionController,
    getDailyNutritionSummaryController
};