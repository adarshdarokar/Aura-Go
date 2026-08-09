const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const generateAccessToken = (userId) => {
    return jwt.sign(
        {
            userId
        },
        authConfig.jwtSecret,
        {
            expiresIn: authConfig.accessTokenExpiry
        }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            userId
        },
        authConfig.jwtSecret,
        {
            expiresIn: authConfig.refreshTokenExpiry
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};