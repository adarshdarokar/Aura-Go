const requiredEnvVariables = [
    "MONGODB_URI"
];

const validateEnv = () => {
    const missingVariables = requiredEnvVariables.filter(
        (variable) => !process.env[variable]
    );

    if (missingVariables.length > 0) {
        throw new Error(
            `Missing environment variables: ${missingVariables.join(", ")}`
        );
    }
};

module.exports = validateEnv;