const User = require("../models/User");
const Session = require("../models/Session");

const {
    hashRefreshToken
} = require("./tokenService");

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("Email is already registered");
        error.statusCode = 409;
        throw error;
    }

    const user = await User.create({
        name,
        email,
        password
    });

    return user;
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    return user;
};

const createSession = async (userId, refreshToken) => {
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const session = await Session.create({
        user: userId,
        refreshTokenHash,
        expiresAt
    });

    return session;
};

module.exports = {
    registerUser,
    loginUser,
    createSession
};