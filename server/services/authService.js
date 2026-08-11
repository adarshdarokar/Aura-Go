const User = require("../models/User");
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth");

const {
    hashRefreshToken,
    compareRefreshToken
} = require("./tokenService");

/* ---------- Register ---------- */

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

/* ---------- Login ---------- */

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

/* ---------- Create Session ---------- */

const createSession = async (userId) => {
    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const session = await Session.create({
        user: userId,
        refreshTokenHash: "pending",
        expiresAt
    });

    return session;
};

/* ---------- Attach Refresh Token ---------- */

const attachRefreshToken = async (sessionId, refreshToken) => {
    const refreshTokenHash = await hashRefreshToken(refreshToken);

    const session = await Session.findByIdAndUpdate(
        sessionId,
        {
            refreshTokenHash
        },
        {
            new: true
        }
    );

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 401;
        throw error;
    }

    return session;
};

/* ---------- Refresh Session ---------- */

const refreshSession = async (refreshToken) => {
    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            authConfig.jwtSecret
        );
    } catch (error) {
        const authError = new Error(
            "Invalid or expired refresh token"
        );
        authError.statusCode = 401;
        throw authError;
    }

    if (!decoded.userId || !decoded.sessionId) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
    }

    const session = await Session.findById(
        decoded.sessionId
    );

    if (!session) {
        const error = new Error("Invalid refresh session");
        error.statusCode = 401;
        throw error;
    }

    if (session.user.toString() !== decoded.userId) {
        const error = new Error("Invalid refresh session");
        error.statusCode = 401;
        throw error;
    }

    if (session.expiresAt <= new Date()) {
        await Session.deleteOne({
            _id: session._id
        });

        const error = new Error("Refresh session expired");
        error.statusCode = 401;
        throw error;
    }

    const isValid = await compareRefreshToken(
        refreshToken,
        session.refreshTokenHash
    );

    if (!isValid) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
    }

    return session;
};

module.exports = {
    registerUser,
    loginUser,
    createSession,
    attachRefreshToken,
    refreshSession
};