const {
    registerUser,
    loginUser,
    createSession,
    attachRefreshToken,
    refreshSession
} = require("../services/authService");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../services/tokenService");

const { setAuthCookies } = require("../utils/cookie");

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

        const accessToken = generateAccessToken(session.user);

        setAuthCookies(res, accessToken, refreshToken);

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    me,
    refresh
};