const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/exercises", exerciseRoutes);

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "AURA GO API is healthy"
    });
});

module.exports = router;