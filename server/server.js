const dotenv = require("dotenv");
const connectDB = require("./config/db");
const validateEnv = require("./config/env");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        validateEnv();

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