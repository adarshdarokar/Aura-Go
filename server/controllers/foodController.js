
const {
    searchFoods
} = require("../services/foodService");

const searchFoodsController = async (req, res, next) => {
    try {
        const query =
            typeof req.query.q === "string"
                ? req.query.q
                : "";

        const category =
            typeof req.query.category === "string"
                ? req.query.category
                : "";

        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);

        const validCategories = [
            "grains",
            "pulses",
            "dairy",
            "eggs",
            "meat",
            "vegetables",
            "fruits",
            "nuts_seeds",
            "oils_fats",
            "other"
        ];

        if (category && !validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid food category"
            });
        }

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be >= 1 and limit must be between 1 and 100"
            });
        }

        const result = await searchFoods({
            query,
            category,
            page,
            limit
        });

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchFoodsController
};
