import { useState } from "react";
import backgroundImage from "../assets/background-img.png";

import Button from "../components/Button";
import Input from "../components/Input";

function Auth() {
    const [mode, setMode] = useState("login");

    const isLogin = mode === "login";

    return (
        <main className="relative min-h-[100dvh] overflow-x-hidden bg-[#241b15] font-sans text-[#f4eadf]">

            {/* =====================================================
                BACKGROUND
                ===================================================== */}

            <div className="fixed inset-0 z-0">

                <img
                    src={backgroundImage}
                    alt="AURA GO gym"
                    className="
                        h-full
                        w-full
                        object-cover
                        object-center
                    "
                />

                {/* Natural dark cinematic layer */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[#241b15]/[0.08]
                    "
                />

                {/* Bottom depth */}
                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-[35%]
                        bg-gradient-to-t
                        from-[#241b15]/[0.32]
                        via-transparent
                        to-transparent
                    "
                />

            </div>


            {/* =====================================================
                CONTENT
                ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-[100dvh]
                    items-center
                    justify-center
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-10
                "
            >

                <AuthCard
                    isLogin={isLogin}
                    setMode={setMode}
                />

            </div>

        </main>
    );
}


/* =========================================================
   AUTH CARD
   ========================================================= */

function AuthCard({
    isLogin,
    setMode
}) {
    return (
        <div
            className="
                w-full

                max-w-[330px]

                sm:max-w-[350px]

                md:max-w-[360px]

                lg:max-w-[370px]

                rounded-[22px]

                border
                border-[#e8cdb0]/[0.20]

                bg-[#33251c]/[0.52]

                p-5

                sm:p-6

                md:p-7

                shadow-[0_24px_80px_rgba(25,12,5,0.30)]

                backdrop-blur-[14px]
            "
        >

            <AuthContent
                isLogin={isLogin}
                setMode={setMode}
            />

        </div>
    );
}


/* =========================================================
   AUTH CONTENT
   ========================================================= */

function AuthContent({
    isLogin,
    setMode
}) {
    return (
        <>
            {/* Heading */}

            <div className="mb-6">

                <p
                    className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.30em]
                        text-[#d9b996]/[0.80]
                    "
                >
                    {isLogin
                        ? "WELCOME BACK"
                        : "CREATE ACCOUNT"}
                </p>

                <h1
                    className="
                        mt-2
                        text-[27px]
                        font-extrabold
                        leading-none
                        tracking-[-0.045em]
                        text-[#fff8ef]

                        sm:text-[29px]
                    "
                >
                    {isLogin
                        ? "Sign in"
                        : "Get started"}
                </h1>

            </div>


            {/* Form */}

            <form className="space-y-4">

                {!isLogin && (
                    <Input
                        label="Full name"
                        name="name"
                        placeholder="Your name"
                    />
                )}


                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                />


                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                />


                {!isLogin && (
                    <Input
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                    />
                )}


                {/* Login options */}

                {isLogin && (
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            pt-1
                        "
                    >

                        <label
                            className="
                                flex
                                min-w-0
                                cursor-pointer
                                items-center
                                gap-2
                                text-[10px]
                                text-[#d8bea2]/[0.76]
                            "
                        >

                            <input
                                type="checkbox"
                                className="
                                    h-3.5
                                    w-3.5
                                    shrink-0
                                    accent-[#cba77f]
                                "
                            />

                            <span>
                                Remember me
                            </span>

                        </label>


                        <button
                            type="button"
                            className="
                                shrink-0
                                text-[10px]
                                text-[#d8bea2]/[0.82]
                                transition-colors
                                hover:text-[#fff8ef]
                            "
                        >
                            Forgot password?
                        </button>

                    </div>
                )}


                {/* Submit */}

                <Button
                    className="
                        mt-1
                        h-11
                        w-full
                        rounded-xl

                        !border
                        !border-[#f5e5d3]/[0.28]

                        !bg-[#e1cdb7]

                        !text-[#2a1d15]

                        font-medium

                        shadow-[0_8px_25px_rgba(20,10,5,0.18)]

                        transition-all
                        duration-200

                        hover:!bg-[#f0e2d2]

                        active:scale-[0.99]
                    "
                >
                    {isLogin
                        ? "Sign in"
                        : "Create account"}
                </Button>

            </form>


            {/* Switch */}

            <div
                className="
                    mt-5
                    border-t
                    border-[#dcb995]/[0.14]
                    pt-4
                    text-center
                    text-[10px]
                    text-[#d6baa0]/[0.72]
                "
            >

                {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}

                <button
                    type="button"
                    onClick={() =>
                        setMode(
                            isLogin
                                ? "signup"
                                : "login"
                        )
                    }
                    className="
                        ml-1
                        font-semibold
                        text-[#fff8ef]
                        transition-colors
                        hover:text-[#e4c4a3]
                    "
                >
                    {isLogin
                        ? "Sign up"
                        : "Sign in"}
                </button>

            </div>

        </>
    );
}

export default Auth;