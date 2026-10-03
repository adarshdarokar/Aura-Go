const {
    calculateNutritionTargets
} = require("../services/nutritionTargetService");

const getNutritionTargets = async (
    req,
    res,
    next
) => {
    try {
        const targets = await calculateNutritionTargets(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: {
                targets
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNutritionTargets
};