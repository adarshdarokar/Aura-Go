
const mongoose = require("mongoose");
const Nutrition = require("../models/Nutrition");

const getDateRange = (date) => {
  const dateString = date || new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const error = new Error("Date must be in YYYY-MM-DD format");
    error.statusCode = 400;
    throw error;
  }

  const startDate = new Date(`${dateString}T00:00:00+05:30`);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

  return { startDate, endDate };
};

const createNutrition = async (userId, nutritionData) => {
  const nutrition = await Nutrition.create({
    user: userId,
    ...nutritionData,
  });

  return nutrition;
};

const getUserNutrition = async (userId, date) => {
  const filter = {
    user: userId,
  };

  if (date) {
    const { startDate, endDate } = getDateRange(date);

    filter.date = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  return Nutrition.find(filter).sort({
    date: -1,
    createdAt: -1,
  });
};

const getNutritionById = async (userId, nutritionId) => {
  const nutrition = await Nutrition.findOne({
    _id: nutritionId,
    user: userId,
  });

  if (!nutrition) {
    const error = new Error("Nutrition entry not found");
    error.statusCode = 404;
    throw error;
  }

  return nutrition;
};

const updateNutrition = async (userId, nutritionId, nutritionData) => {
  const nutrition = await Nutrition.findOneAndUpdate(
    {
      _id: nutritionId,
      user: userId,
    },
    nutritionData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!nutrition) {
    const error = new Error("Nutrition entry not found");
    error.statusCode = 404;
    throw error;
  }

  return nutrition;
};

const deleteNutrition = async (userId, nutritionId) => {
  const nutrition = await Nutrition.findOneAndDelete({
    _id: nutritionId,
    user: userId,
  });

  if (!nutrition) {
    const error = new Error("Nutrition entry not found");
    error.statusCode = 404;
    throw error;
  }

  return nutrition;
};

const getDailyNutritionSummary = async (userId, date) => {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    throw error;
    
  }

  const { startDate, endDate } = getDateRange(date);
   
  console.log("Summary userId:", userId);
  console.log("Summary date:", date);
  console.log("Start:", startDate.toISOString());
  console.log("End:", endDate.toISOString());

  const summary = await Nutrition.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        calories: { $sum: "$calories" },
        protein: { $sum: "$protein" },
        carbohydrates: { $sum: "$carbohydrates" },
        fiber: { $sum: "$fiber" },
        totalMeals: { $sum: 1 },
      },
    },
  ]);

  if (summary.length === 0) {
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fiber: 0,
      totalMeals: 0,
    };
  }

  const {
    calories,
    protein,
    carbohydrates,
    fiber,
    totalMeals,
  } = summary[0];

  return {
    calories,
    protein,
    carbohydrates,
    fiber,
    totalMeals,
  };
};

module.exports = {
  createNutrition,
  getUserNutrition,
  getNutritionById,
  updateNutrition,
  deleteNutrition,
  getDailyNutritionSummary,
};
