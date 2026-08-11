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

const hashRefreshToken = async (refreshToken) => {
    return bcrypt.hash(refreshToken, 12);
};

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
    generateRefreshToken
};