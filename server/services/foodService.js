const Food = require("../models/Food");

const searchFoods = async ({ query, category, page = 1, limit = 20 }) => {
  const filter = {
    isActive: true,
  };

  if (query && query.trim()) {
    filter.name = {
      $regex: query.trim(),
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  const skip = (page - 1) * limit;

  const [foods, total] = await Promise.all([
    Food.find(filter)
      .select(
        "name normalizedName category servingUnit caloriesPer100g proteinPer100g carbsPer100g fiberPer100g",
      )
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Food.countDocuments(filter),
  ]);

  return {
    foods,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const calculateFoodNutrition = async (foodId, quantity) => {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    const error = new Error("Quantity must be greater than zero");
    error.statusCode = 400;
    throw error;
  }

  const food = await Food.findOne({
    _id: foodId,
    isActive: true,
  }).lean();

  if (!food) {
    const error = new Error("Food not found");
    error.statusCode = 404;
    throw error;
  }

  const factor = quantity / 100;

  const round = (value) => Math.round(value * 10) / 10;

  return {
    food: {
      id: food._id,
      name: food.name,
      servingUnit: food.servingUnit,
    },
    quantity,
    nutrition: {
      calories: round(food.caloriesPer100g * factor),
      protein: round(food.proteinPer100g * factor),
      carbohydrates: round(food.carbsPer100g * factor),
      fiber: round(food.fiberPer100g * factor),
    },
  };
};

module.exports = {
  searchFoods,
  calculateFoodNutrition,
};
