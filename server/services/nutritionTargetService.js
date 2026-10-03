const User = require("../models/User");

const calculateNutritionTargets = async (userId) => {
    const user = await User.findById(userId).select(
        "age gender height weight fitnessLevel goal"
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        !user.age ||
        !user.gender ||
        !user.height ||
        !user.weight ||
        !user.fitnessLevel ||
        !user.goal
    ) {
        const error = new Error(
            "Complete profile data is required to calculate nutrition targets"
        );

        error.statusCode = 400;
        throw error;
    }

    /* ---------- BMR ---------- */

    let bmr;

    if (user.gender === "male") {
        bmr =
            10 * user.weight +
            6.25 * user.height -
            5 * user.age +
            5;
    } else {
        bmr =
            10 * user.weight +
            6.25 * user.height -
            5 * user.age -
            161;
    }

    /* ---------- Activity Multiplier ---------- */

    const activityMultiplier = {
        beginner: 1.375,
        intermediate: 1.55,
        advanced: 1.725
    };

    const multiplier =
        activityMultiplier[user.fitnessLevel] || 1.375;

    const tdee = bmr * multiplier;

    /* ---------- Goal Adjustment ---------- */

    let calories = tdee;

    switch (user.goal) {
        case "weight_gain":
            calories += 300;
            break;

        case "weight_loss":
            calories -= 300;
            break;

        case "strength":
            calories += 200;
            break;

        case "general_fitness":
        case "maintenance":
        default:
            calories = tdee;
            break;
    }

    /* ---------- Protein Target ---------- */

    let proteinPerKg = 1.6;

    switch (user.goal) {
        case "weight_gain":
            proteinPerKg = 1.8;
            break;

        case "weight_loss":
            proteinPerKg = 2.0;
            break;

        case "strength":
            proteinPerKg = 1.8;
            break;

        case "general_fitness":
        case "maintenance":
        default:
            proteinPerKg = 1.6;
            break;
    }

    const protein = user.weight * proteinPerKg;

    return {
        calories: Math.round(calories),
        protein: Math.round(protein),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee)
    };
};

module.exports = {
    calculateNutritionTargets
};