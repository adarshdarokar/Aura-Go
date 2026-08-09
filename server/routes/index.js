const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "AURA GO API is healthy"
    });
});

module.exports = router;