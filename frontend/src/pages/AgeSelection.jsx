
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
    <main className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#090909] font-sans text-[#EDEDED] selection:bg-white/20">

      {/* Background ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(180,180,180,0.10),transparent_42%),radial-gradient(ellipse_at_50%_100%,rgba(98,98,98,0.12),transparent_45%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Main content */}
      <section className="relative flex h-full w-full items-center justify-center overflow-y-auto px-5 py-8 sm:px-8 sm:py-10 lg:px-10">

        <div className="w-full max-w-[460px]">

          {/* Header */}
          <div className="mb-10 sm:mb-12">

            {/* Step indicator */}
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#B4B4B4]/80" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B4B4B4]">
                Step 03
              </p>

              <span className="h-px flex-1 bg-gradient-to-r from-[#777777]/50 to-transparent" />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#777777]">
              Personalize your profile
            </p>

            <h1 className="mt-4 text-[38px] font-semibold leading-[1.04] tracking-[-0.05em] text-[#F5F5F5] sm:text-[46px]">
              How old are you?
            </h1>

            <p className="mt-5 max-w-[350px] text-[13px] leading-[1.9] text-[#A5A5A5]">
              Your age helps us personalize your training and fitness recommendations.
            </p>
          </div>

          {/* Age input */}
          <div>

            <label
              htmlFor="age"
              className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#999999]"
            >
              Age
            </label>

            <div className="group relative">

              <input
                id="age"
                type="number"
                min="13"
                max="100"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="Enter your age"
                className="
                  h-[70px] w-full rounded-[18px]
                  border border-[#626262]/40
                  bg-[#626262]/[0.10]
                  px-5 pr-16
                  text-[19px] font-medium text-[#F5F5F5]
                  outline-none
                  transition-all duration-300
                  placeholder:text-[#626262]
                  hover:border-[#999999]/50
                  hover:bg-[#626262]/[0.13]
                  focus:border-[#EDEDED]/[0.70]
                  focus:bg-[#626262]/[0.17]
                  focus:ring-4 focus:ring-white/[0.035]
                "
              />

              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777777] transition-colors group-focus-within:text-[#D0D0D0]">
                Years
              </span>

            </div>

            <p className="mt-3 text-[10px] leading-[1.7] text-[#777777]">
              Enter an age between 13 and 100.
            </p>

          </div>

          {/* Bottom action */}
          <div className="mt-11 sm:mt-14">

            <button
              type="button"
              disabled={!age}
              onClick={handleNext}
              className="
                group relative flex h-[58px] w-full
                items-center justify-center gap-3
                overflow-hidden rounded-[18px]
                border border-[#EDEDED]/[0.20]
                bg-[#EDEDED]
                text-[14px] font-semibold tracking-[0.01em]
                text-[#0E0E0E]
                shadow-[0_12px_35px_rgba(0,0,0,0.28)]
                transition-all duration-300
                hover:bg-[#D5D5D5]
                hover:shadow-[0_16px_42px_rgba(0,0,0,0.38)]
                active:scale-[0.985]
                disabled:cursor-not-allowed
                disabled:bg-[#626262]
                disabled:text-[#B4B4B4]
                disabled:opacity-45
                disabled:shadow-none
              "
            >
              <span className="relative z-10">Continue</span>

              <span className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </button>

            {/* Progress indicator */}
            <div className="mt-9 flex items-center justify-center gap-2">

              <span className="h-[3px] w-8 rounded-full bg-[#EDEDED]" />
              <span className="h-[3px] w-[4px] rounded-full bg-[#626262]" />
              <span className="h-[3px] w-[4px] rounded-full bg-[#626262]" />
              <span className="h-[3px] w-[4px] rounded-full bg-[#626262]" />

            </div>

            <p className="mt-4 text-center text-[9px] font-medium uppercase tracking-[0.24em] text-[#777777]">
              Building your profile
            </p>

          </div>

        </div>
      </section>
    </main>
  );
}

export default AgeSelection;
