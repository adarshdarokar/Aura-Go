
const {
    calculateFoodNutrition
} = require("../services/foodService");

const calculateFoodNutritionController = async (
    req,
    res,
    next
) => {
    try {
        const { foodId, quantity } = req.body;

        if (!foodId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Food ID and quantity are required"
            });
        }

        const parsedQuantity = Number(quantity);

        if (
            !Number.isFinite(parsedQuantity) ||
            parsedQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a number greater than zero"
            });
        }

        const result = await calculateFoodNutrition(
            foodId,
            parsedQuantity
        );

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    calculateFoodNutritionController
};
