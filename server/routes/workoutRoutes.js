const express = require("express");

const {
    createWorkoutController,
    getUserWorkoutsController,
    getWorkoutByIdController,
    updateWorkoutController,
    deleteWorkoutController
} = require("../controllers/workoutController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    createWorkoutController
);

router.get(
    "/",
    protect,
    getUserWorkoutsController
);

router.get(
    "/:id",
    protect,
    getWorkoutByIdController
);

router.patch(
    "/:id",
    protect,
    updateWorkoutController
);

router.delete(
    "/:id",
    protect,
    deleteWorkoutController
);

module.exports = router;
