const {
    registerUser,
    loginUser
} = require("../services/authService");

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

module.exports = {
    register,
    login
};