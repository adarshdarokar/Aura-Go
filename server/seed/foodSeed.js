const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Food = require("../models/Food");

const foods = [
    {
        name: "White Rice (Cooked)",
        normalizedName: "white rice cooked",
        category: "grains",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 130,
        proteinPer100g: 2.7,
        carbsPer100g: 28.2,
        fiberPer100g: 0.4
    },
    {
        name: "White Rice (Raw)",
        normalizedName: "white rice raw",
        category: "grains",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 365,
        proteinPer100g: 7.1,
        carbsPer100g: 80,
        fiberPer100g: 1.3
    },
    {
        name: "Whole Wheat Flour (Atta)",
        normalizedName: "whole wheat flour atta",
        category: "grains",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 340,
        proteinPer100g: 13.2,
        carbsPer100g: 72,
        fiberPer100g: 10.7
    },
    {
        name: "Roti (Plain)",
        normalizedName: "roti plain",
        category: "grains",
        servingUnit: "pcs",
        gramsPerPiece: 40,
        caloriesPer100g: 297,
        proteinPer100g: 9.8,
        carbsPer100g: 55.7,
        fiberPer100g: 8
    },
    {
        name: "Oats (Dry)",
        normalizedName: "oats dry",
        category: "grains",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 389,
        proteinPer100g: 16.9,
        carbsPer100g: 66.3,
        fiberPer100g: 10.6
    },
    {
        name: "Soya Chunks (Dry)",
        normalizedName: "soya chunks dry",
        category: "pulses",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 345,
        proteinPer100g: 52,
        carbsPer100g: 33,
        fiberPer100g: 13
    },
    {
        name: "Lentils (Raw)",
        normalizedName: "lentils raw",
        category: "pulses",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 352,
        proteinPer100g: 24.6,
        carbsPer100g: 63.1,
        fiberPer100g: 10.7
    },
    {
        name: "Moong Dal (Raw)",
        normalizedName: "moong dal raw",
        category: "pulses",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 347,
        proteinPer100g: 24,
        carbsPer100g: 63,
        fiberPer100g: 16
    },
    {
        name: "Chickpeas (Boiled)",
        normalizedName: "chickpeas boiled",
        category: "pulses",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 164,
        proteinPer100g: 8.9,
        carbsPer100g: 27.4,
        fiberPer100g: 7.6
    },
    {
        name: "Egg (Whole, Raw)",
        normalizedName: "egg whole raw",
        category: "eggs",
        servingUnit: "pcs",
        gramsPerPiece: 50,
        caloriesPer100g: 143,
        proteinPer100g: 12.6,
        carbsPer100g: 0.7,
        fiberPer100g: 0
    },
    {
        name: "Buffalo Milk",
        normalizedName: "buffalo milk",
        category: "dairy",
        servingUnit: "ml",
        gramsPerPiece: null,
        caloriesPer100g: 97,
        proteinPer100g: 3.8,
        carbsPer100g: 5.2,
        fiberPer100g: 0
    },
    {
        name: "Cow Milk (Whole)",
        normalizedName: "cow milk whole",
        category: "dairy",
        servingUnit: "ml",
        gramsPerPiece: null,
        caloriesPer100g: 61,
        proteinPer100g: 3.2,
        carbsPer100g: 4.8,
        fiberPer100g: 0
    },
    {
        name: "Paneer",
        normalizedName: "paneer",
        category: "dairy",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 265,
        proteinPer100g: 18.3,
        carbsPer100g: 1.2,
        fiberPer100g: 0
    },
    {
        name: "Plain Curd",
        normalizedName: "plain curd",
        category: "dairy",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 61,
        proteinPer100g: 3.5,
        carbsPer100g: 4.7,
        fiberPer100g: 0
    },
    {
        name: "Banana",
        normalizedName: "banana",
        category: "fruits",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 89,
        proteinPer100g: 1.1,
        carbsPer100g: 22.8,
        fiberPer100g: 2.6
    },
    {
        name: "Apple",
        normalizedName: "apple",
        category: "fruits",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 52,
        proteinPer100g: 0.3,
        carbsPer100g: 13.8,
        fiberPer100g: 2.4
    },
    {
        name: "Tomato",
        normalizedName: "tomato",
        category: "vegetables",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 18,
        proteinPer100g: 0.9,
        carbsPer100g: 3.9,
        fiberPer100g: 1.2
    },
    {
        name: "Onion",
        normalizedName: "onion",
        category: "vegetables",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 40,
        proteinPer100g: 1.1,
        carbsPer100g: 9.3,
        fiberPer100g: 1.7
    },
    {
        name: "Potato (Raw)",
        normalizedName: "potato raw",
        category: "vegetables",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 77,
        proteinPer100g: 2,
        carbsPer100g: 17.5,
        fiberPer100g: 2.2
    },
    {
        name: "Spinach",
        normalizedName: "spinach",
        category: "vegetables",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 23,
        proteinPer100g: 2.9,
        carbsPer100g: 3.6,
        fiberPer100g: 2.2
    },
    {
        name: "Almonds",
        normalizedName: "almonds",
        category: "nuts_seeds",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 579,
        proteinPer100g: 21.2,
        carbsPer100g: 21.6,
        fiberPer100g: 12.5
    },
    {
        name: "Peanuts",
        normalizedName: "peanuts",
        category: "nuts_seeds",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 567,
        proteinPer100g: 25.8,
        carbsPer100g: 16.1,
        fiberPer100g: 8.5
    },
    {
        name: "Chia Seeds",
        normalizedName: "chia seeds",
        category: "nuts_seeds",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 486,
        proteinPer100g: 16.5,
        carbsPer100g: 42.1,
        fiberPer100g: 34.4
    },
    {
        name: "Pumpkin Seeds",
        normalizedName: "pumpkin seeds",
        category: "nuts_seeds",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 559,
        proteinPer100g: 30.2,
        carbsPer100g: 10.7,
        fiberPer100g: 6
    },
    {
        name: "Ghee",
        normalizedName: "ghee",
        category: "oils_fats",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 900,
        proteinPer100g: 0,
        carbsPer100g: 0,
        fiberPer100g: 0
    },
    {
        name: "Cooking Oil",
        normalizedName: "cooking oil",
        category: "oils_fats",
        servingUnit: "g",
        gramsPerPiece: null,
        caloriesPer100g: 884,
        proteinPer100g: 0,
        carbsPer100g: 0,
        fiberPer100g: 0
    }
];

const seedFoods = async () => {
    try {
        await connectDB();

        let inserted = 0;
        let updated = 0;

        for (const food of foods) {
            const existingFood = await Food.findOne({
                normalizedName: food.normalizedName
            });

            if (existingFood) {
                await Food.updateOne(
                    { _id: existingFood._id },
                    { $set: food },
                    { runValidators: true }
                );

                updated++;
            } else {
                await Food.create(food);
                inserted++;
            }
        }

        console.log(
            `AURA GO: ${inserted} foods inserted, ${updated} foods updated`
        );

        process.exit(0);
    } catch (error) {
        console.error("Food seeding failed:", error.message);
        process.exit(1);
    }
};

seedFoods();