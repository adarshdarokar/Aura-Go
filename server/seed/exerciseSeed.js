const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Exercise = require("../models/Exercise");

const exercises = [
    {
        name: "Barbell Bench Press",
        slug: "barbell-bench-press",
        description:
            "A compound upper-body exercise focused primarily on the chest.",
        primaryMuscles: ["chest"],
        secondaryMuscles: ["triceps", "front delts"],
        equipment: ["barbell", "flat bench", "weight plates"],
        difficulty: "intermediate",
        category: "strength",
        instructions: [
            "Lie flat on the bench with your feet firmly on the floor.",
            "Grip the bar slightly wider than shoulder width.",
            "Lower the bar under control toward the middle of your chest.",
            "Press the bar upward until your arms are extended."
        ],
        commonMistakes: [
            "Bouncing the bar off the chest.",
            "Lifting the hips off the bench.",
            "Using an unstable grip."
        ],
        safetyTip:
            "Keep your shoulder blades stable and use a spotter when lifting heavy.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    },

    {
        name: "Barbell Back Squat",
        slug: "barbell-back-squat",
        description:
            "A compound lower-body movement that develops the legs and glutes.",
        primaryMuscles: ["quadriceps"],
        secondaryMuscles: ["glutes", "hamstrings", "core"],
        equipment: ["barbell", "squat rack", "weight plates"],
        difficulty: "intermediate",
        category: "strength",
        instructions: [
            "Position the bar securely across your upper back.",
            "Brace your core and keep your chest controlled.",
            "Lower your body by bending your knees and hips.",
            "Drive through your feet to return to the starting position."
        ],
        commonMistakes: [
            "Allowing the knees to collapse inward.",
            "Losing core tension.",
            "Rounding the lower back."
        ],
        safetyTip:
            "Use an appropriate load and maintain a stable squat position throughout the movement.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    },

    {
        name: "Conventional Deadlift",
        slug: "conventional-deadlift",
        description:
            "A full-body compound movement emphasizing the posterior chain.",
        primaryMuscles: ["hamstrings", "glutes"],
        secondaryMuscles: ["lower back", "traps", "core"],
        equipment: ["barbell", "weight plates"],
        difficulty: "advanced",
        category: "strength",
        instructions: [
            "Stand with your feet around hip width apart.",
            "Grip the bar and brace your core.",
            "Keep your back stable while driving through your feet.",
            "Extend your hips and knees to stand tall.",
            "Lower the bar under control."
        ],
        commonMistakes: [
            "Rounding the back.",
            "Jerking the bar from the floor.",
            "Hyperextending at the top."
        ],
        safetyTip:
            "Keep the bar close to your body and prioritize technique over load.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    },

    {
        name: "Lat Pulldown",
        slug: "lat-pulldown",
        description:
            "A controlled pulling exercise targeting the muscles of the upper back.",
        primaryMuscles: ["lats"],
        secondaryMuscles: ["biceps", "upper back"],
        equipment: ["cable machine", "lat pulldown bar"],
        difficulty: "beginner",
        category: "strength",
        instructions: [
            "Sit securely at the machine and grip the bar.",
            "Keep your chest lifted and shoulders controlled.",
            "Pull the bar toward your upper chest.",
            "Slowly return the bar to the starting position."
        ],
        commonMistakes: [
            "Swinging the torso.",
            "Pulling the bar behind the neck.",
            "Using momentum instead of controlled movement."
        ],
        safetyTip:
            "Keep the movement controlled and avoid excessive loading.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    },

    {
        name: "Seated Cable Row",
        slug: "seated-cable-row",
        description:
            "A horizontal pulling movement for developing the upper and middle back.",
        primaryMuscles: ["mid back"],
        secondaryMuscles: ["lats", "biceps", "rear delts"],
        equipment: ["cable machine", "row handle"],
        difficulty: "beginner",
        category: "strength",
        instructions: [
            "Sit upright and brace your core.",
            "Grip the handle with your arms extended.",
            "Pull the handle toward your torso.",
            "Squeeze your back before returning under control."
        ],
        commonMistakes: [
            "Rounding the back.",
            "Using excessive momentum.",
            "Shrugging the shoulders."
        ],
        safetyTip:
            "Maintain a neutral spine throughout the movement.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    },

    {
        name: "Dumbbell Shoulder Press",
        slug: "dumbbell-shoulder-press",
        description:
            "An overhead pressing exercise focused on shoulder strength.",
        primaryMuscles: ["shoulders"],
        secondaryMuscles: ["triceps", "upper chest"],
        equipment: ["dumbbells", "bench"],
        difficulty: "beginner",
        category: "strength",
        instructions: [
            "Sit upright with a dumbbell in each hand.",
            "Start with the dumbbells around shoulder height.",
            "Press both dumbbells overhead.",
            "Lower them slowly back to shoulder height."
        ],
        commonMistakes: [
            "Overarching the lower back.",
            "Using momentum.",
            "Lowering the weights too quickly."
        ],
        safetyTip:
            "Use a controlled range of motion and a manageable load.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    },

    {
        name: "Dumbbell Bicep Curl",
        slug: "dumbbell-bicep-curl",
        description:
            "An isolation exercise targeting the elbow flexors.",
        primaryMuscles: ["biceps"],
        secondaryMuscles: ["forearms"],
        equipment: ["dumbbells"],
        difficulty: "beginner",
        category: "strength",
        instructions: [
            "Stand upright with a dumbbell in each hand.",
            "Keep your elbows close to your sides.",
            "Curl the dumbbells toward your shoulders.",
            "Lower the weights slowly."
        ],
        commonMistakes: [
            "Swinging the body.",
            "Moving the elbows forward.",
            "Dropping the weight too quickly."
        ],
        safetyTip:
            "Keep the movement controlled and avoid excessive momentum.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    },

    {
        name: "Bodyweight Push-Up",
        slug: "bodyweight-push-up",
        description:
            "A bodyweight pressing exercise targeting the chest and upper body.",
        primaryMuscles: ["chest"],
        secondaryMuscles: ["triceps", "front delts", "core"],
        equipment: ["bodyweight"],
        difficulty: "beginner",
        category: "strength",
        instructions: [
            "Start in a plank position with your hands slightly wider than your shoulders.",
            "Brace your core and keep your body aligned.",
            "Lower your chest toward the floor.",
            "Push through your hands to return to the starting position."
        ],
        commonMistakes: [
            "Letting the hips sag.",
            "Flaring the elbows excessively.",
            "Performing partial repetitions."
        ],
        safetyTip:
            "Maintain a straight body line and use a controlled range of motion.",
        thumbnail: "",
        video: {
            url: "",
            duration: 0,
            thumbnail: ""
        }
    }
];


const seedExercises = async () => {
    try {
        await connectDB();

        await Exercise.deleteMany({});

        await Exercise.insertMany(exercises);

        console.log(
            `AURA GO: ${exercises.length} exercises seeded successfully`
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Exercise seeding failed:",
            error.message
        );

        process.exit(1);
    }
};


seedExercises();