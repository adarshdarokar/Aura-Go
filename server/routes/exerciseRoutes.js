const express = require("express");

const {
    getAllExercises,
    getExerciseDetails,
    getVariations
} = require("../controllers/exerciseController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


/* ---------- Exercise List ---------- */

router.get(
    "/",
    protect,
    getAllExercises
);


/* ---------- Exercise Details ---------- */

router.get(
    "/:id",
    protect,
    getExerciseDetails
);


/* ---------- Exercise Variations ---------- */

router.get(
    "/:id/variations",
    protect,
    getVariations
);


module.exports = router;