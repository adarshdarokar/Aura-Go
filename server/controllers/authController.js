const {
    registerUser,
    loginUser,
    createSession,
    attachRefreshToken,
    refreshSession,
    logoutSession
} = require("../services/authService");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../services/tokenService");

const {
    setAuthCookies,
    clearAuthCookies
} = require("../utils/cookie");

/* ---------- Register ---------- */

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser({
            name,
            email,
            password
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/* ---------- Login ---------- */

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser({
            email,
            password
        });

        const accessToken = generateAccessToken(user._id);

        const session = await createSession(user._id);

        const refreshToken = generateRefreshToken(
            user._id,
            session._id
        );

        await attachRefreshToken(
            session._id,
            refreshToken
        );

        setAuthCookies(
            res,
            accessToken,
            refreshToken
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/* ---------- Current User ---------- */

const me = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user.id
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/* ---------- Refresh Token ---------- */

const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        const session = await refreshSession(refreshToken);

        const accessToken = generateAccessToken(
            session.user
        );

        const newRefreshToken = generateRefreshToken(
            session.user,
            session._id
        );

        await attachRefreshToken(
            session._id,
            newRefreshToken
        );

        setAuthCookies(
            res,
            accessToken,
            newRefreshToken
        );

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully"
        });
    } catch (error) {
        next(error);
    }
};

/* ---------- Logout ---------- */

const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        await logoutSession(refreshToken);

        clearAuthCookies(res);

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    me,
    refresh,
    logout
};