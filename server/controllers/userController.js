const {
    getUserProfile,
    updateUserProfile
} = require("../services/userService");

/* ---------- Get Profile ---------- */

const getProfile = async (req, res, next) => {
    try {
        const user = await getUserProfile(req.user.id);

        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    gender: user.gender,
                    height: user.height,
                    weight: user.weight,
                    fitnessLevel: user.fitnessLevel,
                    goal: user.goal
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/* ---------- Update Profile ---------- */

const updateProfile = async (req, res, next) => {
    try {
        const user = await updateUserProfile(
            req.user.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    gender: user.gender,
                    height: user.height,
                    weight: user.weight,
                    fitnessLevel: user.fitnessLevel,
                    goal: user.goal
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile
};