
const Food = require("../models/Food");

const searchFoods = async ({
    query,
    category,
    page = 1,
    limit = 20
}) => {
    const filter = {
        isActive: true
    };

    if (query && query.trim()) {
        filter.name = {
            $regex: query.trim(),
            $options: "i"
        };
    }

    if (category) {
        filter.category = category;
    }

    const skip = (page - 1) * limit;

    const [foods, total] = await Promise.all([
        Food.find(filter)
            .select(
                "name normalizedName category servingUnit caloriesPer100g proteinPer100g carbsPer100g fiberPer100g"
            )
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Food.countDocuments(filter)
    ]);

    return {
        foods,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

module.exports = {
    searchFoods
};
