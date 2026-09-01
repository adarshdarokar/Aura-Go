const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Exercise = require("../models/Exercise");

const seedVariations = async () => {
    try {
        await connectDB();

        const benchPress = await Exercise.findOne({
            slug: "barbell-bench-press"
        });

        if (!benchPress) {
            throw new Error(
                "Barbell Bench Press not found. Run exerciseSeed.js first."
            );
        }

        const variations = [
            {
                name: "Incline Barbell Bench Press",
                slug: "incline-barbell-bench-press",
                description:
                    "A bench press variation that places more emphasis on the upper chest.",
                primaryMuscles: ["upper chest"],
                secondaryMuscles: ["triceps", "front delts"],
                equipment: [
                    "barbell",
                    "incline bench",
                    "weight plates"
                ],
                difficulty: "intermediate",
                category: "strength",
                instructions: [
                    "Set the bench to a moderate incline.",
                    "Lie back and grip the bar slightly wider than shoulder width.",
                    "Lower the bar toward the upper chest.",
                    "Press the bar upward under control."
                ],
                commonMistakes: [
                    "Using an excessively steep bench angle.",
                    "Bouncing the bar.",
                    "Losing shoulder stability."
                ],
                safetyTip:
                    "Keep the bench stable and use a spotter for heavy sets.",
                thumbnail: "",
                video: {
                    url: "",
                    duration: 0,
                    thumbnail: ""
                },
                variationOf: benchPress._id
            },

            {
                name: "Decline Barbell Bench Press",
                slug: "decline-barbell-bench-press",
                description:
                    "A bench press variation performed on a decline bench.",
                primaryMuscles: ["lower chest"],
                secondaryMuscles: ["triceps", "front delts"],
                equipment: [
                    "barbell",
                    "decline bench",
                    "weight plates"
                ],
                difficulty: "intermediate",
                category: "strength",
                instructions: [
                    "Secure yourself on the decline bench.",
                    "Grip the bar slightly wider than shoulder width.",
                    "Lower the bar toward the lower chest.",
                    "Press the bar upward while maintaining control."
                ],
                commonMistakes: [
                    "Using excessive weight.",
                    "Losing body position on the bench.",
                    "Dropping the bar too quickly."
                ],
                safetyTip:
                    "Make sure your legs and upper body are securely positioned before lifting.",
                thumbnail: "",
                video: {
                    url: "",
                    duration: 0,
                    thumbnail: ""
                },
                variationOf: benchPress._id
            },

            {
                name: "Close Grip Bench Press",
                slug: "close-grip-bench-press",
                description:
                    "A bench press variation using a narrower grip to increase triceps involvement.",
                primaryMuscles: ["triceps"],
                secondaryMuscles: ["chest", "front delts"],
                equipment: [
                    "barbell",
                    "flat bench",
                    "weight plates"
                ],
                difficulty: "intermediate",
                category: "strength",
                instructions: [
                    "Lie flat on the bench with your feet firmly planted.",
                    "Grip the bar narrower than your normal bench press grip.",
                    "Lower the bar toward the lower chest.",
                    "Press the bar upward while keeping your elbows controlled."
                ],
                commonMistakes: [
                    "Using an extremely narrow grip.",
                    "Flaring the elbows.",
                    "Using excessive momentum."
                ],
                safetyTip:
                    "Choose a grip that feels comfortable for your wrists and shoulders.",
                thumbnail: "",
                video: {
                    url: "",
                    duration: 0,
                    thumbnail: ""
                },
                variationOf: benchPress._id
            },

            {
                name: "Paused Barbell Bench Press",
                slug: "paused-barbell-bench-press",
                description:
                    "A bench press variation that includes a controlled pause at the bottom of each repetition.",
                primaryMuscles: ["chest"],
                secondaryMuscles: ["triceps", "front delts"],
                equipment: [
                    "barbell",
                    "flat bench",
                    "weight plates"
                ],
                difficulty: "advanced",
                category: "strength",
                instructions: [
                    "Set up as you would for a standard bench press.",
                    "Lower the bar under control.",
                    "Pause briefly with the bar at the chest.",
                    "Press the bar upward without bouncing."
                ],
                commonMistakes: [
                    "Bouncing the bar after the pause.",
                    "Losing core tension.",
                    "Using too much weight."
                ],
                safetyTip:
                    "Use a manageable load and maintain full control during the pause.",
                thumbnail: "",
                video: {
                    url: "",
                    duration: 0,
                    thumbnail: ""
                },
                variationOf: benchPress._id
            }
        ];

        await Exercise.deleteMany({
            variationOf: benchPress._id
        });

        await Exercise.insertMany(variations);

        console.log(
            `AURA GO: ${variations.length} bench press variations seeded successfully`
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Variation seeding failed:",
            error.message
        );

        process.exit(1);
    }
};

seedVariations();