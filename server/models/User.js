const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        age: {
            type: Number,
            min: 13,
            max: 100
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },

        height: {
            type: Number,
            min: 50,
            max: 250
        },

        weight: {
            type: Number,
            min: 20,
            max: 300
        },

        fitnessLevel: {
            type: String,
            enum: ["beginner", "intermediate", "pro"]
        },

        goal: {
            type: String,
            enum: [
                "weight_gain",
                "weight_loss",
                "maintenance",
                "strength",
                "general_fitness"
            ]
        }
    },
    {
        timestamps: true
    }
);

/* ---------- Password Hashing ---------- */

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

/* ---------- Password Verification ---------- */

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;