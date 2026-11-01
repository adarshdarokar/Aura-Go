
const express = require("express");

const {
  getAllMuscleTutorialsController,
  getMuscleTutorialByNameController,
} = require("../controllers/muscleTutorialController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAllMuscleTutorialsController);

router.get("/:muscle", protect, getMuscleTutorialByNameController);

module.exports = router;
