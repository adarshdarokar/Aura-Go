const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const router = express.Router();
const workoutRoutes = require("./workoutRoutes");
const nutritionRoutes = require("./nutritionRoutes");
const foodController = require("../controllers/foodController");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/exercises", exerciseRoutes);
router.use("/workouts", workoutRoutes);
router.use("/nutrition", nutritionRoutes);

// Food Search Route
router.get(
    "/foods",
    foodController.searchFoodsController
);

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "AURA GO API is healthy"
    });
});

module.exports = router;