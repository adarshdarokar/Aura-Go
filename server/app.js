const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");
const apiRoutes = require("./routes");
const apiLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AURA GO API is running"
    });
});

app.use("/api", apiLimiter);
app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;