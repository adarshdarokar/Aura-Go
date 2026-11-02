
const mongoose = require("mongoose");
require("dotenv").config();

const Exercise = require("../models/Exercise");
const MuscleTutorial = require("../models/MuscleTutorial");

const muscleData = [
  {
    muscle: "chest",
    groups: [
      {
        name: "Upper Chest",
        slugs: ["incline-bench-press"],
      },
      {
        name: "Middle Chest",
        slugs: ["barbell-bench-press", "bodyweight-push-up"],
      },
      {
        name: "Lower Chest",
        slugs: ["decline-bench-press"],
      },
    ],
  },
  {
    muscle: "back",
    groups: [
      { name: "Lats", slugs: ["lat-pulldown"] },
      { name: "Upper Back", slugs: ["seated-cable-row"] },
      { name: "Middle Back", slugs: ["seated-cable-row"] },
      { name: "Lower Back", slugs: ["conventional-deadlift"] },
    ],
  },
  {
    muscle: "shoulders",
    groups: [
      { name: "Front Delts", slugs: ["dumbbell-shoulder-press"] },
      { name: "Side Delts", slugs: [] },
      { name: "Rear Delts", slugs: [] },
    ],
  },
  {
    muscle: "biceps",
    groups: [
      { name: "Long Head", slugs: ["dumbbell-curl"] },
      { name: "Short Head", slugs: ["dumbbell-curl"] },
      { name: "Brachialis", slugs: [] },
    ],
  },
  {
    muscle: "triceps",
    groups: [
      { name: "Long Head", slugs: [] },
      { name: "Lateral Head", slugs: [] },
      { name: "Medial Head", slugs: [] },
    ],
  },
  {
    muscle: "legs",
    groups: [
      { name: "Quadriceps", slugs: ["barbell-back-squat"] },
      { name: "Hamstrings", slugs: ["conventional-deadlift"] },
      {
        name: "Glutes",
        slugs: ["barbell-back-squat", "conventional-deadlift"],
      },
      { name: "Calves", slugs: [] },
    ],
  },
  {
    muscle: "abs",
    groups: [
      { name: "Upper Abs", slugs: [] },
      { name: "Lower Abs", slugs: [] },
      { name: "Obliques", slugs: [] },
    ],
  },
];

const seedMuscleTutorials = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    for (const muscleItem of muscleData) {
      const groups = [];

      for (const group of muscleItem.groups) {
        const exercises = group.slugs.length
          ? await Exercise.find({
              slug: { $in: group.slugs },
              isActive: true,
            }).select("_id")
          : [];

        const foundSlugs = exercises.length;

        groups.push({
          name: group.name,
          description: `${group.name} muscle tutorial`,
          exercises: exercises.map((exercise) => exercise._id),
          video: {
            url: "",
            duration: 0,
            thumbnail: "",
          },
        });

        if (group.slugs.length && foundSlugs === 0) {
          console.log(
            `Warning: No matching exercise found for ${group.name}`
          );
        }
      }

      await MuscleTutorial.findOneAndUpdate(
        { muscle: muscleItem.muscle },
        {
          $set: {
            groups,
            isActive: true,
          },
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
        }
      );

      console.log(`Seeded: ${muscleItem.muscle}`);
    }

    console.log("All muscle tutorials seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedMuscleTutorials();
