const express = require("express");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "AURA GO API is healthy"
    });
});

router.use("/auth", authRoutes);

module.exports = router;