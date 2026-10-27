const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const router = express.Router();
const workoutRoutes = require("./workoutRoutes");
const nutritionRoutes = require("./nutritionRoutes");
const progressRoutes = require("./progressRoutes");
const foodController = require("../controllers/foodController");
const {
  calculateFoodNutritionController,
} = require("../controllers/foodCalculationController");
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/workouts", workoutRoutes);
router.use("/nutrition", nutritionRoutes);
router.use("/progress", progressRoutes);

// Food Search Route
router.get("/foods", foodController.searchFoodsController);

router.post("/foods/calculate", calculateFoodNutritionController);


router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AURA GO API is healthy",
  });
});

module.exports = router;
