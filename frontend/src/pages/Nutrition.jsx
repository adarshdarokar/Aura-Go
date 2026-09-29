import { useState } from "react";
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const mealTypes = [
    "breakfast",
    "lunch",
    "dinner",
    "snack"
];

function Nutrition() {
    const [formData, setFormData] = useState({
        mealType: "",
        mealName: "",
        calories: "",
        protein: "",
        carbohydrates: "",
        fiber: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const {
            mealType,
            mealName,
            calories,
            protein,
            carbohydrates,
            fiber
        } = formData;

        if (
            !mealType ||
            !mealName ||
            !calories ||
            !protein ||
            !carbohydrates ||
            !fiber
        ) {
            setError("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${API_URL}/nutrition`,
                {
                    date: new Date().toISOString(),
                    mealType,
                    mealName: mealName.trim(),
                    calories: Number(calories),
                    protein: Number(protein),
                    carbohydrates: Number(carbohydrates),
                    fiber: Number(fiber)
                },
                {
                    withCredentials: true
                }
            );

            setSuccess(
                "Meal added successfully."
            );

            setFormData({
                mealType: "",
                mealName: "",
                calories: "",
                protein: "",
                carbohydrates: "",
                fiber: ""
            });
        } catch (error) {
            console.error(
                "Failed to add nutrition:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to add meal."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="
                min-h-[100dvh]
                bg-[#0E0E0E]
                px-5
                py-6
                font-sans
                text-[#EDEDED]
                sm:px-8
                lg:px-10
                lg:py-8
            "
        >
            <div className="mx-auto w-full max-w-[720px]">

                {/* Header */}
                <div className="mb-8">

                    <p
                        className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.34em]
                            text-[#626262]
                        "
                    >
                        AURA GO
                    </p>

                    <h1
                        className="
                            mt-2
                            text-[30px]
                            font-semibold
                            tracking-[-0.045em]
                            text-[#EDEDED]
                            sm:text-[36px]
                        "
                    >
                        Nutrition
                    </h1>

                    <p
                        className="
                            mt-2
                            max-w-[420px]
                            text-[10px]
                            leading-[1.7]
                            text-[#626262]
                        "
                    >
                        Track your meals and keep your
                        daily nutrition on target.
                    </p>
                </div>

                {/* Form Card */}
                <section
                    className="
                        rounded-[24px]
                        border
                        border-[#626262]/[0.28]
                        bg-[#626262]/[0.08]
                        p-5
                        shadow-[0_20px_60px_rgba(0,0,0,0.22)]
                        sm:p-7
                    "
                >

                    <div className="mb-6">
                        <p
                            className="
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-[#626262]
                            "
                        >
                            Add nutrition
                        </p>

                        <h2
                            className="
                                mt-1.5
                                text-[18px]
                                font-semibold
                                tracking-[-0.025em]
                                text-[#EDEDED]
                            "
                        >
                            Log a meal
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* Meal Type */}
                        <div>
                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.22em]
                                    text-[#626262]
                                "
                            >
                                Meal Type
                            </label>

                            <select
                                value={formData.mealType}
                                onChange={(event) =>
                                    handleChange(
                                        "mealType",
                                        event.target.value
                                    )
                                }
                                className="
                                    h-[48px]
                                    w-full
                                    rounded-[13px]
                                    border
                                    border-[#626262]/[0.34]
                                    bg-[#171717]
                                    px-4
                                    text-[11px]
                                    font-medium
                                    text-[#EDEDED]
                                    outline-none
                                    transition-all
                                    focus:border-[#B4B4B4]/[0.55]
                                "
                            >
                                <option value="">
                                    Select meal type
                                </option>

                                {mealTypes.map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type
                                            .charAt(0)
                                            .toUpperCase() +
                                            type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Meal Name */}
                        <div>
                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.22em]
                                    text-[#626262]
                                "
                            >
                                Meal Name
                            </label>

                            <input
                                type="text"
                                value={formData.mealName}
                                onChange={(event) =>
                                    handleChange(
                                        "mealName",
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Chicken rice bowl"
                                className="
                                    h-[48px]
                                    w-full
                                    rounded-[13px]
                                    border
                                    border-[#626262]/[0.34]
                                    bg-[#626262]/[0.10]
                                    px-4
                                    text-[11px]
                                    font-medium
                                    text-[#EDEDED]
                                    outline-none
                                    placeholder:text-[#626262]
                                    focus:border-[#B4B4B4]/[0.55]
                                    focus:bg-[#626262]/[0.15]
                                "
                            />
                        </div>

                        {/* Calories */}
                        <div>
                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.22em]
                                    text-[#626262]
                                "
                            >
                                Calories
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={formData.calories}
                                onChange={(event) =>
                                    handleChange(
                                        "calories",
                                        event.target.value
                                    )
                                }
                                placeholder="0"
                                className="
                                    h-[48px]
                                    w-full
                                    rounded-[13px]
                                    border
                                    border-[#626262]/[0.34]
                                    bg-[#626262]/[0.10]
                                    px-4
                                    text-[11px]
                                    font-medium
                                    text-[#EDEDED]
                                    outline-none
                                    placeholder:text-[#626262]
                                    focus:border-[#B4B4B4]/[0.55]
                                    focus:bg-[#626262]/[0.15]
                                "
                            />
                        </div>

                        {/* Macros */}
                        <div className="grid gap-3 sm:grid-cols-3">

                            <MacroInput
                                label="Protein"
                                value={formData.protein}
                                onChange={(value) =>
                                    handleChange(
                                        "protein",
                                        value
                                    )
                                }
                            />

                            <MacroInput
                                label="Carbs"
                                value={formData.carbohydrates}
                                onChange={(value) =>
                                    handleChange(
                                        "carbohydrates",
                                        value
                                    )
                                }
                            />

                            <MacroInput
                                label="Fiber"
                                value={formData.fiber}
                                onChange={(value) =>
                                    handleChange(
                                        "fiber",
                                        value
                                    )
                                }
                            />

                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="
                                    rounded-[12px]
                                    border
                                    border-red-400/20
                                    bg-red-400/10
                                    px-4
                                    py-3
                                    text-[9px]
                                    text-red-300
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div
                                className="
                                    rounded-[12px]
                                    border
                                    border-[#B4B4B4]/20
                                    bg-[#B4B4B4]/10
                                    px-4
                                    py-3
                                    text-[9px]
                                    text-[#C0C1C1]
                                "
                            >
                                {success}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                mt-2
                                h-[50px]
                                w-full
                                rounded-[14px]
                                bg-[#EDEDED]
                                text-[11px]
                                font-semibold
                                text-[#0E0E0E]
                                shadow-[0_12px_30px_rgba(0,0,0,0.25)]
                                transition-all
                                duration-300
                                hover:bg-[#C0C1C1]
                                active:scale-[0.98]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Saving..."
                                : "Save Meal →"}
                        </button>

                    </form>
                </section>
            </div>
        </main>
    );
}

function MacroInput({
    label,
    value,
    onChange
}) {
    return (
        <div>
            <label
                className="
                    mb-1.5
                    block
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#626262]
                "
            >
                {label}
            </label>

            <input
                type="number"
                min="0"
                step="0.1"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder="0"
                className="
                    h-[48px]
                    w-full
                    rounded-[13px]
                    border
                    border-[#626262]/[0.34]
                    bg-[#626262]/[0.10]
                    px-4
                    text-[11px]
                    font-medium
                    text-[#EDEDED]
                    outline-none
                    placeholder:text-[#626262]
                    focus:border-[#B4B4B4]/[0.55]
                    focus:bg-[#626262]/[0.15]
                "
            />
        </div>
    );
}

export default Nutrition;