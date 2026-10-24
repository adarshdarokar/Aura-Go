
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AgeSelection() {
    const navigate = useNavigate();

    const [age, setAge] = useState("");

    const handleNext = () => {
        if (!age) return;

        console.log("Selected age:", age);

        navigate("/onboarding/height");
    };

    return (
        <main
            className="
                relative
                h-[100dvh]
                overflow-hidden
                bg-[#090909]
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
                    bg-[radial-gradient(circle_at_50%_20%,rgba(180,180,180,0.09),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(98,98,98,0.10),transparent_42%)]
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
                <div className="w-full max-w-[460px]">

                    {/* Header */}
                    <div className="mb-10 sm:mb-12">

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-9 bg-[#B4B4B4]/70" />

                            <p
                                className="
                                    text-[10px]
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
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-[#777777]
                            "
                        >
                            PERSONALIZE YOUR PROFILE
                        </p>

                        <h1
                            className="
                                mt-4
                                text-[36px]
                                font-semibold
                                leading-[1.02]
                                tracking-[-0.045em]
                                text-[#F5F5F5]
                                sm:text-[42px]
                            "
                        >
                            How old are you?
                        </h1>

                        <p
                            className="
                                mt-5
                                max-w-[350px]
                                text-[13px]
                                leading-[1.8]
                                text-[#A5A5A5]
                            "
                        >
                            Your age helps us personalize your
                            training and fitness recommendations.
                        </p>
                    </div>

                    {/* Age Input */}
                    <div>
                        <label
                            htmlFor="age"
                            className="
                                mb-3
                                block
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.24em]
                                text-[#888888]
                            "
                        >
                            Age
                        </label>

                        <div className="relative">
                            <input
                                id="age"
                                type="number"
                                min="13"
                                max="100"
                                value={age}
                                onChange={(event) =>
                                    setAge(event.target.value)
                                }
                                placeholder="Enter your age"
                                className="
                                    h-[68px]
                                    w-full
                                    rounded-[18px]
                                    border
                                    border-[#626262]/[0.38]
                                    bg-[#626262]/[0.10]
                                    px-5
                                    pr-16
                                    text-[18px]
                                    font-medium
                                    text-[#F5F5F5]
                                    outline-none
                                    transition-all
                                    duration-300
                                    placeholder:text-[#626262]
                                    focus:border-[#EDEDED]/[0.65]
                                    focus:bg-[#626262]/[0.16]
                                    focus:ring-2
                                    focus:ring-[#EDEDED]/[0.05]
                                "
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#777777]
                                "
                            >
                                Years
                            </span>
                        </div>

                        <p
                            className="
                                mt-3
                                text-[10px]
                                leading-[1.7]
                                text-[#777777]
                            "
                        >
                            Enter an age between 13 and 100.
                        </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-10 sm:mt-12">

                        <button
                            type="button"
                            disabled={!age}
                            onClick={handleNext}
                            className="
                                group
                                flex
                                h-[56px]
                                w-full
                                items-center
                                justify-center
                                gap-3
                                rounded-[18px]
                                border
                                border-[#EDEDED]/[0.20]
                                bg-[#EDEDED]
                                text-[14px]
                                font-semibold
                                tracking-[0.01em]
                                text-[#0E0E0E]
                                shadow-[0_12px_35px_rgba(0,0,0,0.28)]
                                transition-all
                                duration-300
                                hover:bg-[#D5D5D5]
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
                            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </button>

                        {/* Progress */}
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <span className="h-[3px] w-8 rounded-full bg-[#EDEDED]" />
                            <span className="h-[3px] w-[4px] rounded-full bg-[#626262]" />
                            <span className="h-[3px] w-[4px] rounded-full bg-[#626262]" />
                            <span className="h-[3px] w-[4px] rounded-full bg-[#626262]" />
                        </div>

                        <p
                            className="
                                mt-4
                                text-center
                                text-[9px]
                                uppercase
                                tracking-[0.24em]
                                text-[#777777]
                            "
                        >
                            Building your profile
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AgeSelection;
