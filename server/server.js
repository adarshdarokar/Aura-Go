const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`AURA GO server running on port ${PORT}`);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received. Shutting down AURA GO...`);

            server.close(() => {
                console.log("HTTP server closed");
                process.exit(0);
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();