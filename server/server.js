const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");
const apiRoutes = require("./routes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AURA GO API is running"
    });
});

app.use("/api", apiRoutes);

// Error handling — ALWAYS AFTER ROUTES
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`AURA GO server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();