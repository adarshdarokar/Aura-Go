const express = require("express");

const {
    createNutritionController,
    getUserNutritionController,
    getNutritionByIdController,
    updateNutritionController,
    deleteNutritionController
} = require("../controllers/nutritionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    createNutritionController
);

router.get(
    "/",
    protect,
    getUserNutritionController
);

router.get(
    "/:id",
    protect,
    getNutritionByIdController
);

router.patch(
    "/:id",
    protect,
    updateNutritionController
);

router.delete(
    "/:id",
    protect,
    deleteNutritionController
);

module.exports = router;