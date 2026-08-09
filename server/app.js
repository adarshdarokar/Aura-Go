const express = require("express");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");
const apiRoutes = require("./routes");

const app = express();

app.use(express.json());

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