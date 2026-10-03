const express = require("express");

const {
    createNutritionController,
    getUserNutritionController,
    getNutritionByIdController,
    updateNutritionController,
    deleteNutritionController,
    getDailyNutritionSummaryController
} = require("../controllers/nutritionController");

const {
    getNutritionTargets
} = require("../controllers/nutritionTargetController");

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
    "/summary",
    protect,
    getDailyNutritionSummaryController
);

router.get(
    "/targets",
    protect,
    getNutritionTargets
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