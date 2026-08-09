const User = require("../models/User");

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

module.exports = {
    registerUser
};