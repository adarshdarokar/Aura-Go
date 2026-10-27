const express = require("express");
const router = express.Router();

const {
  createProgress,
  getProgressHistory,
  deleteProgress,
} = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");
router.use(protect);

router.post("/", createProgress);
router.get("/", getProgressHistory);
router.delete("/:id", deleteProgress);

module.exports = router;