const {
    calculateFoodNutrition
} = require("../services/foodService");

const Food = require("../models/Food");
const Nutrition = require("../models/Nutrition");

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


const addFoodMealController = async (req, res, next) => {
    try {
        const { foodId, quantity, mealType, date } = req.body;

        if (
            !foodId ||
            quantity === undefined ||
            !mealType
        ) {
            return res.status(400).json({
                success: false,
                message: "Food ID, quantity and meal type are required"
            });
        }

        const validMealTypes = [
            "breakfast",
            "lunch",
            "dinner",
            "snack"
        ];

        if (!validMealTypes.includes(mealType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal type"
            });
        }

        const parsedQuantity = Number(quantity);

        if (
            !Number.isFinite(parsedQuantity) ||
            parsedQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero"
            });
        }

        const calculated = await calculateFoodNutrition(
            foodId,
            parsedQuantity
        );

        const food = await Food.findById(foodId).select(
            "name servingUnit"
        );

        const mealDate = date ? new Date(date) : new Date();

        if (Number.isNaN(mealDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date"
            });
        }

        const nutrition = await Nutrition.create({
            user: req.user.id,
            date: mealDate,
            mealType,
            mealName: `${food.name} (${parsedQuantity}${food.servingUnit})`,
            calories: calculated.nutrition.calories,
            protein: calculated.nutrition.protein,
            carbohydrates: calculated.nutrition.carbohydrates,
            fiber: calculated.nutrition.fiber
        });

        return res.status(201).json({
            success: true,
            message: "Food meal added successfully",
            data: {
                nutrition,
                calculatedNutrition: calculated.nutrition
            }
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
    addFoodMealController,
    getUserNutritionController,
    getNutritionByIdController,
    updateNutritionController,
    deleteNutritionController,
    getDailyNutritionSummaryController
};