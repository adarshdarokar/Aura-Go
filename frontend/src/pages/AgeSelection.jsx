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
                            PERSONALIZE YOUR PROFILE
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
                            How old are you?
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
                            Your age helps us personalize your
                            training and fitness recommendations.
                        </p>
                    </div>

                    {/* Age Input */}
                    <div>
                        <label
                            htmlFor="age"
                            className="
                                mb-2
                                block
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.24em]
                                text-[#626262]
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
                                    h-[58px]
                                    w-full
                                    rounded-[16px]
                                    border
                                    border-[#626262]/[0.34]
                                    bg-[#626262]/[0.12]
                                    px-5
                                    pr-16
                                    text-[14px]
                                    font-medium
                                    text-[#EDEDED]
                                    outline-none
                                    transition-all
                                    duration-300
                                    placeholder:text-[#626262]
                                    focus:border-[#B4B4B4]/[0.55]
                                    focus:bg-[#626262]/[0.18]
                                    focus:ring-1
                                    focus:ring-[#B4B4B4]/[0.12]
                                "
                            />

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#626262]
                                "
                            >
                                Years
                            </span>
                        </div>

                        <p
                            className="
                                mt-3
                                text-[9px]
                                leading-[1.6]
                                text-[#626262]
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
                            Building your profile
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AgeSelection;