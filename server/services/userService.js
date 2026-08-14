const User = require("../models/User");

const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select(
        "-password"
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const updateUserProfile = async (
    userId,
    profileData
) => {
    const allowedFields = [
        "age",
        "gender",
        "height",
        "weight",
        "fitnessLevel",
        "goal"
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (profileData[field] !== undefined) {
            updates[field] = profileData[field];
        }
    }
    if (Object.keys(updates).length === 0) {
        const error = new Error("No valid profile fields provided");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updates,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};
const changeUserPassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await user.comparePassword(
        currentPassword
    );

    if (!isPasswordValid) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 401;
        throw error;
    }

    if (currentPassword === newPassword) {
        const error = new Error(
            "New password must be different from current password"
        );
        error.statusCode = 400;
        throw error;
    }

    user.password = newPassword;

    await user.save();

    return true;
};
module.exports = {
    getUserProfile,
    updateUserProfile,
    changeUserPassword
};