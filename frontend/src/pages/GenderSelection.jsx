import { useState } from "react";
import { useNavigate } from "react-router-dom";

const genders = [
  {
    id: "male",
    title: "Male",
    description:
      "Personalize your fitness journey with a masculine visual experience.",
  },
  {
    id: "female",
    title: "Female",
    description:
      "Personalize your fitness journey with a feminine visual experience.",
  },
];

function GenderSelection() {
  const navigate = useNavigate();

  const [selectedGender, setSelectedGender] = useState("");

  const handleNext = () => {
    if (!selectedGender) return;

    sessionStorage.setItem("auraGender", selectedGender);

    navigate("/onboarding/profile");
  };

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
      {/* Ambient background */}
      <div
        className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_50%_20%,rgba(180,180,180,0.07),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(98,98,98,0.08),transparent_42%)]
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
                    py-8
                    sm:px-8
                    sm:py-10
                    lg:px-10
                    lg:py-12
                "
      >
        <div className="w-full max-w-[430px]">
          {/* Header */}
          <div className="mb-10 sm:mb-12">
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
                Step 02
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
              PERSONALIZE YOUR EXPERIENCE
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
              What's your gender?
            </h1>

            <p
              className="
                                mt-4
                                max-w-[340px]
                                text-[11px]
                                leading-[1.7]
                                text-[#B4B4B4]
                            "
            >
              This helps us personalize your visual experience throughout AURA
              GO.
            </p>
          </div>

          {/* Gender Options */}
          <div className="space-y-4">
            {genders.map((gender, index) => {
              const isSelected = selectedGender === gender.id;

              return (
                <button
                  key={gender.id}
                  type="button"
                  onClick={() => setSelectedGender(gender.id)}
                  className={`
                                        group
                                        relative
                                        w-full
                                        overflow-hidden
                                        rounded-[20px]
                                        border
                                        px-5
                                        py-6
                                        text-left
                                        transition-all
                                        duration-300
                                        ease-out
                                        sm:px-6
                                        sm:py-7

                                        ${
                                          isSelected
                                            ? `
                                                    border-[#EDEDED]/[0.65]
                                                    bg-[#EDEDED]
                                                    text-[#0E0E0E]
                                                    shadow-[0_18px_50px_rgba(0,0,0,0.40)]
                                                  `
                                            : `
                                                    border-[#626262]/[0.34]
                                                    bg-[#626262]/[0.12]
                                                    text-[#EDEDED]
                                                    shadow-[0_10px_30px_rgba(0,0,0,0.16)]
                                                    hover:border-[#B4B4B4]/[0.42]
                                                    hover:bg-[#626262]/[0.18]
                                                  `
                                        }
                                    `}
                >
                  {isSelected && (
                    <div
                      className="
                                                pointer-events-none
                                                absolute
                                                inset-0
                                                bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.22),transparent_70%)]
                                            "
                    />
                  )}

                  <div className="relative flex items-center gap-5">
                    {/* Number */}
                    <div
                      className={`
                                                flex
                                                h-12
                                                w-12
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-[14px]
                                                border
                                                text-[10px]
                                                font-semibold
                                                tracking-[0.08em]
                                                transition-all
                                                duration-300

                                                ${
                                                  isSelected
                                                    ? `
                                                            border-[#0E0E0E]/[0.12]
                                                            bg-[#0E0E0E]/[0.06]
                                                            text-[#0E0E0E]
                                                          `
                                                    : `
                                                            border-[#626262]/[0.30]
                                                            bg-[#0E0E0E]/[0.28]
                                                            text-[#B4B4B4]
                                                          `
                                                }
                                            `}
                    >
                      0{index + 1}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h2
                        className={`
                                                    text-[15px]
                                                    font-semibold
                                                    tracking-[-0.01em]
                                                    ${
                                                      isSelected
                                                        ? "text-[#0E0E0E]"
                                                        : "text-[#EDEDED]"
                                                    }
                                                `}
                      >
                        {gender.title}
                      </h2>

                      <p
                        className={`
                                                    mt-1.5
                                                    text-[9px]
                                                    leading-[1.6]
                                                    ${
                                                      isSelected
                                                        ? "text-[#0E0E0E]/[0.58]"
                                                        : "text-[#B4B4B4]"
                                                    }
                                                `}
                      >
                        {gender.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div
                      className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                text-[14px]
                                                transition-all
                                                duration-300

                                                ${
                                                  isSelected
                                                    ? `
                                                            border-[#0E0E0E]/[0.12]
                                                            text-[#0E0E0E]
                                                          `
                                                    : `
                                                            border-[#626262]/[0.22]
                                                            text-[#626262]
                                                            group-hover:translate-x-1
                                                            group-hover:text-[#B4B4B4]
                                                          `
                                                }
                                            `}
                    >
                      →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue */}
          <div className="mt-9 sm:mt-10">
            <button
              type="button"
              disabled={!selectedGender}
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
              Continue
            </button>

            {/* Progress */}
            <div className="mt-7 flex items-center justify-center gap-2">
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

            <p
              className="
                                mt-4
                                text-center
                                text-[8px]
                                uppercase
                                tracking-[0.24em]
                                text-[#626262]
                            "
            >
              Your journey starts here
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GenderSelection;
