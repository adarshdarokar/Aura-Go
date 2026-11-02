
const mongoose = require("mongoose");
require("dotenv").config();

const Exercise = require("../models/Exercise");
const MuscleTutorial = require("../models/MuscleTutorial");

// Temporary anatomy images from Wikimedia Commons
const IMAGES = {
  chest:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Anatomical%20illustration%20showing%20muscles%20of%20the%20upper%20torso%20Wellcome%20L0046735.jpg",

  back:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Anatomical%20illustration%20showing%20muscles%20of%20the%20back%20Wellcome%20L0046738.jpg",

  arms:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Anatomical%20illustration%20by%20Arnauld-Eloi%20Gautier-Dagoty%2C%20digitally%20enhanced%20by%20rawpixel-com%2010.jpg",

  legs:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Anatomical%20illustration%20showing%20muscles%20of%20the%20legs%20Wellcome%20L0046751.jpg",

  abs:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Anatomical%20illustration%20showing%20muscles%20of%20the%20torso%20Wellcome%20L0046725.jpg",
};

const muscleData = [
  {
    muscle: "chest",
    groups: [
      {
        name: "Upper Chest",
        slugs: ["incline-bench-press"],
        imageUrl: IMAGES.chest,
      },
      {
        name: "Middle Chest",
        slugs: ["barbell-bench-press", "bodyweight-push-up"],
        imageUrl: IMAGES.chest,
      },
      {
        name: "Lower Chest",
        slugs: ["decline-bench-press"],
        imageUrl: IMAGES.chest,
      },
    ],
  },
  {
    muscle: "back",
    groups: [
      {
        name: "Lats",
        slugs: ["lat-pulldown"],
        imageUrl: IMAGES.back,
      },
      {
        name: "Upper Back",
        slugs: ["seated-cable-row"],
        imageUrl: IMAGES.back,
      },
      {
        name: "Middle Back",
        slugs: ["seated-cable-row"],
        imageUrl: IMAGES.back,
      },
      {
        name: "Lower Back",
        slugs: ["conventional-deadlift"],
        imageUrl: IMAGES.back,
      },
    ],
  },
  {
    muscle: "shoulders",
    groups: [
      {
        name: "Front Delts",
        slugs: ["dumbbell-shoulder-press"],
        imageUrl: IMAGES.arms,
      },
      {
        name: "Side Delts",
        slugs: [],
        imageUrl: IMAGES.arms,
      },
      {
        name: "Rear Delts",
        slugs: [],
        imageUrl: IMAGES.back,
      },
    ],
  },
  {
    muscle: "biceps",
    groups: [
      {
        name: "Long Head",
        slugs: ["dumbbell-curl"],
        imageUrl: IMAGES.arms,
      },
      {
        name: "Short Head",
        slugs: ["dumbbell-curl"],
        imageUrl: IMAGES.arms,
      },
      {
        name: "Brachialis",
        slugs: [],
        imageUrl: IMAGES.arms,
      },
    ],
  },
  {
    muscle: "triceps",
    groups: [
      {
        name: "Long Head",
        slugs: [],
        imageUrl: IMAGES.arms,
      },
      {
        name: "Lateral Head",
        slugs: [],
        imageUrl: IMAGES.arms,
      },
      {
        name: "Medial Head",
        slugs: [],
        imageUrl: IMAGES.arms,
      },
    ],
  },
  {
    muscle: "legs",
    groups: [
      {
        name: "Quadriceps",
        slugs: ["barbell-back-squat"],
        imageUrl: IMAGES.legs,
      },
      {
        name: "Hamstrings",
        slugs: ["conventional-deadlift"],
        imageUrl: IMAGES.legs,
      },
      {
        name: "Glutes",
        slugs: ["conventional-deadlift"],
        imageUrl: IMAGES.legs,
      },
      {
        name: "Calves",
        slugs: [],
        imageUrl: IMAGES.legs,
      },
    ],
  },
  {
    muscle: "abs",
    groups: [
      {
        name: "Upper Abs",
        slugs: [],
        imageUrl: IMAGES.abs,
      },
      {
        name: "Lower Abs",
        slugs: [],
        imageUrl: IMAGES.abs,
      },
      {
        name: "Obliques",
        slugs: [],
        imageUrl: IMAGES.abs,
      },
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

        groups.push({
          name: group.name,
          description: `${group.name} muscle tutorial`,

          exercises: exercises.map((exercise) => exercise._id),

          image: {
            url: group.imageUrl || "",
            alt: `${group.name} anatomy`,
          },

          video: {
            url: "",
            duration: 0,
            thumbnail: "",
          },
        });

        if (group.slugs.length && exercises.length === 0) {
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
