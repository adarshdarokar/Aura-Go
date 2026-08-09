const express = require("express");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");
const apiRoutes = require("./routes");
const helmet = require("helmet");
const apiLimiter = require("./middleware/rateLimiter");
const app = express();


app.use(helmet());

app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AURA GO API is running"
    });
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;