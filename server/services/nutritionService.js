const Nutrition = require("../models/Nutrition");

const createNutrition = async (userId, nutritionData) => {
    const nutrition = await Nutrition.create({
        user: userId,
        ...nutritionData
    });

    return nutrition;
};

const getUserNutrition = async (userId, date) => {
    const filter = {
        user: userId
    };

    if (date) {
        const startDate = new Date(date);

        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);

        endDate.setDate(endDate.getDate() + 1);

        filter.date = {
            $gte: startDate,
            $lt: endDate
        };
    }

    const nutrition = await Nutrition.find(filter)
        .sort({
            date: -1,
            createdAt: -1
        });

    return nutrition;
};

const getNutritionById = async (
    userId,
    nutritionId
) => {
    const nutrition = await Nutrition.findOne({
        _id: nutritionId,
        user: userId
    });

    if (!nutrition) {
        const error = new Error(
            "Nutrition entry not found"
        );

        error.statusCode = 404;

        throw error;
    }

    return nutrition;
};

const updateNutrition = async (
    userId,
    nutritionId,
    nutritionData
) => {
    const nutrition = await Nutrition.findOneAndUpdate(
        {
            _id: nutritionId,
            user: userId
        },
        nutritionData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!nutrition) {
        const error = new Error(
            "Nutrition entry not found"
        );

        error.statusCode = 404;

        throw error;
    }

    return nutrition;
};

const deleteNutrition = async (
    userId,
    nutritionId
) => {
    const nutrition = await Nutrition.findOneAndDelete({
        _id: nutritionId,
        user: userId
    });

    if (!nutrition) {
        const error = new Error(
            "Nutrition entry not found"
        );

        error.statusCode = 404;

        throw error;
    }

    return nutrition;
};

/* ---------- Daily Nutrition Summary ---------- */

const getDailyNutritionSummary = async (
    userId,
    date
) => {
    const startDate = new Date(date);

    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 1);

    const summary = await Nutrition.aggregate([
        {
            $match: {
                user: userId,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $group: {
                _id: null,

                calories: {
                    $sum: "$calories"
                },

                protein: {
                    $sum: "$protein"
                },

                carbohydrates: {
                    $sum: "$carbohydrates"
                },

                fiber: {
                    $sum: "$fiber"
                },

                totalMeals: {
                    $sum: 1
                }
            }
        }
    ]);

    if (!summary.length) {
        return {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fiber: 0,
            totalMeals: 0
        };
    }

    return {
        calories: summary[0].calories,
        protein: summary[0].protein,
        carbohydrates: summary[0].carbohydrates,
        fiber: summary[0].fiber,
        totalMeals: summary[0].totalMeals
    };
};

module.exports = {
    createNutrition,
    getUserNutrition,
    getNutritionById,
    updateNutrition,
    deleteNutrition,
    getDailyNutritionSummary
};