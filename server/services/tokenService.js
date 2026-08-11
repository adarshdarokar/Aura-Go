const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authConfig = require("../config/auth");

/* ---------- Access Token ---------- */

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

/* ---------- Refresh Token ---------- */

const generateRefreshToken = (userId, sessionId) => {
    return jwt.sign(
        {
            userId,
            sessionId
        },
        authConfig.jwtSecret,
        {
            expiresIn: authConfig.refreshTokenExpiry
        }
    );
};

/* ---------- Refresh Token Hash ---------- */

const hashRefreshToken = async (refreshToken) => {
    return bcrypt.hash(refreshToken, 12);
};

/* ---------- Refresh Token Compare ---------- */

const compareRefreshToken = async (
    refreshToken,
    refreshTokenHash
) => {
    return bcrypt.compare(
        refreshToken,
        refreshTokenHash
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    compareRefreshToken
};