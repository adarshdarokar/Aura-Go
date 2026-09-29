import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const experienceOptions = ["Beginner", "Intermediate", "Advanced"];

const trainingDaysOptions = ["1–2 days", "3–4 days", "4–5 days", "6–7 days"];

function ProfileDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    experience: "",
    trainingDays: "",
  });

  const [openSelect, setOpenSelect] = useState("");

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleNext = async () => {
    if (!isComplete) return;

    try {
      const goal = sessionStorage.getItem("auraGoal");
      const gender = sessionStorage.getItem("auraGender");

      const goalMap = {
        "build-muscle": "weight_gain",
        "get-stronger": "strength",
        "lose-fat": "weight_loss",
        "improve-endurance": "general_fitness",
        "stay-healthy": "general_fitness",
      };

      const heightInCm =
        formData.heightUnit === "cm"
          ? Number(formData.height)
          : Number(formData.height) * 30.48;

      const weightInKg =
        formData.weightUnit === "kg"
          ? Number(formData.weight)
          : Number(formData.weight) * 0.453592;

      await axios.patch(
        "http://localhost:5000/api/users/profile",
        {
          age: Number(formData.age),
          gender,
          height: Number(heightInCm.toFixed(1)),
          weight: Number(weightInKg.toFixed(1)),
          fitnessLevel: formData.experience.toLowerCase(),
          goal: goalMap[goal],
        },
        {
          withCredentials: true,
        },
      );

      sessionStorage.removeItem("auraGoal");
      sessionStorage.removeItem("auraGender");

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Profile update failed:",
        error.response?.data || error.message,
      );
    }
  };
  const isComplete =
    formData.age &&
    formData.height &&
    formData.weight &&
    formData.experience &&
    formData.trainingDays;

  return (
    <main
      className="
                relative
                h-[100dvh]
                overflow-hidden
                bg-[#0E0E0E]
                font-sans
                text-[#EDEDED]
            "
    >
      {/* Ambient Background */}
      <div
        className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_50%_15%,rgba(180,180,180,0.07),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(98,98,98,0.08),transparent_42%)]
                "
      />

      <section
        className="
                    relative
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    overflow-y-auto
                    px-5
                    py-7
                    sm:px-8
                    sm:py-9
                    lg:px-10
                    lg:py-10
                "
      >
        <div className="w-full max-w-[430px]">
          {/* Header */}
          <div className="mb-7 sm:mb-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#626262]" />

              <p
                className="
                                    text-[9px]
                                    font-medium
                                    uppercase
                                    tracking-[0.34em]
                                    text-[#B4B4B4]
                                "
              >
                Step 03
              </p>
            </div>

            <p
              className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-[#626262]
                            "
            >
              BUILD YOUR PROFILE
            </p>

            <h1
              className="
                                mt-3
                                text-[30px]
                                font-semibold
                                leading-[0.98]
                                tracking-[-0.045em]
                                text-[#EDEDED]
                                sm:text-[34px]
                            "
            >
              Tell us about yourself
            </h1>

            <p
              className="
                                mt-3
                                max-w-[350px]
                                text-[11px]
                                leading-[1.7]
                                text-[#B4B4B4]
                            "
            >
              These details help us personalize your fitness experience.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {/* Age */}
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
                Age
              </label>

              <input
                type="number"
                min="13"
                max="100"
                value={formData.age}
                onChange={(event) => handleChange("age", event.target.value)}
                placeholder="Enter age"
                className="
                                    h-[47px]
                                    w-full
                                    rounded-[13px]
                                    border
                                    border-[#626262]/[0.34]
                                    bg-[#626262]/[0.12]
                                    px-4
                                    text-[12px]
                                    font-medium
                                    text-[#EDEDED]
                                    outline-none
                                    transition-all
                                    duration-300
                                    placeholder:text-[#626262]
                                    focus:border-[#B4B4B4]/[0.55]
                                    focus:bg-[#626262]/[0.18]
                                "
              />
            </div>

            {/* Height */}
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
                Height
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={formData.height}
                  onChange={(event) =>
                    handleChange("height", event.target.value)
                  }
                  placeholder={formData.heightUnit === "cm" ? "175" : "5'7"}
                  className="
                                        h-[47px]
                                        min-w-0
                                        flex-1
                                        rounded-[13px]
                                        border
                                        border-[#626262]/[0.34]
                                        bg-[#626262]/[0.12]
                                        px-4
                                        text-[12px]
                                        font-medium
                                        text-[#EDEDED]
                                        outline-none
                                        transition-all
                                        duration-300
                                        placeholder:text-[#626262]
                                        focus:border-[#B4B4B4]/[0.55]
                                        focus:bg-[#626262]/[0.18]
                                    "
                />

                <div
                  className="
                                        flex
                                        shrink-0
                                        rounded-[13px]
                                        border
                                        border-[#626262]/[0.34]
                                        bg-[#626262]/[0.12]
                                        p-1
                                    "
                >
                  <button
                    type="button"
                    onClick={() => handleChange("heightUnit", "cm")}
                    className={`
                                            rounded-[9px]
                                            px-3
                                            text-[9px]
                                            font-semibold
                                            transition-all
                                            ${
                                              formData.heightUnit === "cm"
                                                ? "bg-[#EDEDED] text-[#0E0E0E]"
                                                : "text-[#626262]"
                                            }
                                        `}
                  >
                    CM
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange("heightUnit", "ft")}
                    className={`
                                            rounded-[9px]
                                            px-3
                                            text-[9px]
                                            font-semibold
                                            transition-all
                                            ${
                                              formData.heightUnit === "ft"
                                                ? "bg-[#EDEDED] text-[#0E0E0E]"
                                                : "text-[#626262]"
                                            }
                                        `}
                  >
                    FT
                  </button>
                </div>
              </div>
            </div>

            {/* Weight */}
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
                Weight
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={formData.weight}
                  onChange={(event) =>
                    handleChange("weight", event.target.value)
                  }
                  placeholder="70"
                  className="
                                        h-[47px]
                                        min-w-0
                                        flex-1
                                        rounded-[13px]
                                        border
                                        border-[#626262]/[0.34]
                                        bg-[#626262]/[0.12]
                                        px-4
                                        text-[12px]
                                        font-medium
                                        text-[#EDEDED]
                                        outline-none
                                        transition-all
                                        duration-300
                                        placeholder:text-[#626262]
                                        focus:border-[#B4B4B4]/[0.55]
                                        focus:bg-[#626262]/[0.18]
                                    "
                />

                <div
                  className="
                                        flex
                                        shrink-0
                                        rounded-[13px]
                                        border
                                        border-[#626262]/[0.34]
                                        bg-[#626262]/[0.12]
                                        p-1
                                    "
                >
                  <button
                    type="button"
                    onClick={() => handleChange("weightUnit", "kg")}
                    className={`
                                            rounded-[9px]
                                            px-3
                                            text-[9px]
                                            font-semibold
                                            transition-all
                                            ${
                                              formData.weightUnit === "kg"
                                                ? "bg-[#EDEDED] text-[#0E0E0E]"
                                                : "text-[#626262]"
                                            }
                                        `}
                  >
                    KG
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange("weightUnit", "lb")}
                    className={`
                                            rounded-[9px]
                                            px-3
                                            text-[9px]
                                            font-semibold
                                            transition-all
                                            ${
                                              formData.weightUnit === "lb"
                                                ? "bg-[#EDEDED] text-[#0E0E0E]"
                                                : "text-[#626262]"
                                            }
                                        `}
                  >
                    LB
                  </button>
                </div>
              </div>
            </div>

            {/* Experience */}
            <CustomSelect
              label="Experience Level"
              value={formData.experience}
              options={experienceOptions}
              placeholder="Select experience"
              isOpen={openSelect === "experience"}
              onToggle={() =>
                setOpenSelect(openSelect === "experience" ? "" : "experience")
              }
              onSelect={(value) => {
                handleChange("experience", value);
                setOpenSelect("");
              }}
            />

            {/* Training Days */}
            <CustomSelect
              label="Training Days per Week"
              value={formData.trainingDays}
              options={trainingDaysOptions}
              placeholder="Select training days"
              isOpen={openSelect === "trainingDays"}
              onToggle={() =>
                setOpenSelect(
                  openSelect === "trainingDays" ? "" : "trainingDays",
                )
              }
              onSelect={(value) => {
                handleChange("trainingDays", value);
                setOpenSelect("");
              }}
            />
          </div>

          {/* Next */}
          <div className="mt-6 sm:mt-7">
            <button
              type="button"
              disabled={!isComplete}
              onClick={handleNext}
              className="
                                h-[50px]
                                w-full
                                rounded-[15px]
                                border
                                border-[#EDEDED]/[0.18]
                                bg-[#EDEDED]
                                text-[12px]
                                font-semibold
                                tracking-[0.01em]
                                text-[#0E0E0E]
                                shadow-[0_12px_35px_rgba(0,0,0,0.28)]
                                transition-all
                                duration-300
                                hover:bg-[#C0C1C1]
                                hover:shadow-[0_16px_42px_rgba(0,0,0,0.34)]
                                active:scale-[0.985]
                                disabled:cursor-not-allowed
                                disabled:bg-[#626262]
                                disabled:text-[#B4B4B4]
                                disabled:opacity-45
                                disabled:shadow-none
                            "
            >
              Next
            </button>

            {/* Progress */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span
                className="
                                    h-[3px]
                                    w-7
                                    rounded-full
                                    bg-[#EDEDED]
                                "
              />

              <span className="h-[3px] w-[3px] rounded-full bg-[#626262]" />
              <span className="h-[3px] w-[3px] rounded-full bg-[#626262]" />
              <span className="h-[3px] w-[3px] rounded-full bg-[#626262]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CustomSelect({
  label,
  value,
  options,
  placeholder,
  isOpen,
  onToggle,
  onSelect,
}) {
  return (
    <div className="relative">
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

      <button
        type="button"
        onClick={onToggle}
        className={`
                    flex
                    h-[47px]
                    w-full
                    items-center
                    justify-between
                    rounded-[13px]
                    border
                    px-4
                    text-left
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? "border-[#B4B4B4]/[0.55] bg-[#626262]/[0.18]"
                        : "border-[#626262]/[0.34] bg-[#626262]/[0.12]"
                    }
                `}
      >
        <span
          className={`
                        text-[12px]
                        font-medium
                        ${value ? "text-[#EDEDED]" : "text-[#626262]"}
                    `}
        >
          {value || placeholder}
        </span>

        <span
          className={`
                        text-[13px]
                        text-[#626262]
                        transition-transform
                        duration-300
                        ${isOpen ? "rotate-180" : ""}
                    `}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div
          className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+6px)]
                        z-30
                        overflow-hidden
                        rounded-[13px]
                        border
                        border-[#626262]/[0.38]
                        bg-[#171717]
                        p-1
                        shadow-[0_18px_45px_rgba(0,0,0,0.45)]
                    "
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-[10px]
                                px-3
                                py-3
                                text-left
                                text-[10px]
                                font-medium
                                transition-all
                                ${
                                  value === option
                                    ? "bg-[#EDEDED] text-[#0E0E0E]"
                                    : "text-[#B4B4B4] hover:bg-[#626262]/[0.16] hover:text-[#EDEDED]"
                                }
                            `}
            >
              {option}

              {value === option && <span className="text-[11px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileDetails;
