import { useState } from "react";
import axios from "axios";

import desktopBackground from "../assets/background-img.png";
import mobileBackground from "../assets/background-phimg.png";

import AuthContent from "../components/AuthContent";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Auth() {
    const [mode, setMode] = useState("login");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isLogin = mode === "login";

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleModeChange = (nextMode) => {
        setMode(nextMode);

        setError("");
        setSuccess("");

        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const name = formData.name.trim();
        const email = formData.email.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        /* =====================================================
           FRONTEND VALIDATION
           ===================================================== */

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        if (!isLogin) {
            if (!name) {
                setError("Full name is required.");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
        }

        try {
            setLoading(true);

            /* =================================================
               LOGIN
               ================================================= */

            if (isLogin) {
                const response = await axios.post(
                    `${API_URL}/auth/login`,
                    {
                        email,
                        password
                    },
                    {
                        withCredentials: true
                    }
                );

                if (response.data?.success === false) {
                    throw new Error(
                        response.data?.message ||
                        "Login failed."
                    );
                }

                setSuccess(
                    response.data?.message ||
                    "Login successful."
                );

                return;
            }

            /* =================================================
               SIGNUP
               ================================================= */

            const response = await axios.post(
                `${API_URL}/auth/register`,
                {
                    name,
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            if (response.data?.success === false) {
                throw new Error(
                    response.data?.message ||
                    "Account creation failed."
                );
            }

            setSuccess(
                response.data?.message ||
                "Account created successfully."
            );
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-[100dvh] overflow-hidden bg-[#241b15] font-sans text-[#f4eadf]">

            {/* =====================================================
                MOBILE
                IMAGE 35% + FORM 65%
                ===================================================== */}

            <section className="flex h-[100dvh] w-full flex-col overflow-hidden md:hidden">

                {/* =================================================
                    MOBILE IMAGE
                    ================================================= */}

                <div className="relative h-[35%] min-h-0 w-full shrink-0 overflow-hidden">

                    <img
                        src={mobileBackground}
                        alt="AURA GO gym"
                        className="
                            h-full
                            w-full
                            object-cover
                            object-center
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-[#241b15]/[0.035]
                        "
                    />

                </div>

                {/* =================================================
                    MOBILE FORM
                    ================================================= */}

                <div
                    className="
                        relative
                        z-10
                        h-[65%]
                        min-h-0
                        w-full
                        shrink-0
                        overflow-hidden
                        rounded-t-[24px]
                        border
                        border-[#e4c5a5]/[0.20]
                        bg-[#30231b]/[0.46]
                        shadow-[0_24px_80px_rgba(25,12,5,0.28)]
                        backdrop-blur-[13px]
                    "
                >

                    <div
                        className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            overflow-hidden
                            px-5
                            py-4
                            sm:px-7
                            sm:py-5
                        "
                    >

                        <div className="w-full max-w-[360px]">

                            <AuthContent
                                isLogin={isLogin}
                                setMode={handleModeChange}
                                mobile={true}
                                formData={formData}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                loading={loading}
                                error={error}
                                success={success}
                            />

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                TABLET + DESKTOP
                ===================================================== */}

            <section
                className="
                    relative
                    hidden
                    h-[100dvh]
                    w-full
                    overflow-hidden
                    md:block
                "
            >

                <img
                    src={desktopBackground}
                    alt="AURA GO gym"
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        object-center
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[#241b15]/[0.035]
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        bottom-0
                        h-[30%]
                        bg-gradient-to-t
                        from-[#241b15]/[0.20]
                        via-transparent
                        to-transparent
                    "
                />

                <div
                    className="
                        relative
                        z-10
                        flex
                        h-[100dvh]
                        items-center
                        justify-center
                        px-6
                        py-8
                        lg:px-10
                    "
                >

                    <AuthCard
                        isLogin={isLogin}
                        setMode={handleModeChange}
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        success={success}
                    />

                </div>

            </section>

        </main>
    );
}


/* =========================================================
   DESKTOP AUTH CARD
   ========================================================= */

function AuthCard({
    isLogin,
    setMode,
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    success
}) {
    return (
        <div
            className="
                w-full
                max-w-[340px]
                lg:max-w-[360px]

                rounded-[20px]

                border
                border-[#e4c5a5]/[0.20]

                bg-[#30231b]/[0.46]

                p-5
                sm:p-6

                shadow-[0_24px_80px_rgba(25,12,5,0.28)]

                backdrop-blur-[13px]
            "
        >

            <AuthContent
                isLogin={isLogin}
                setMode={setMode}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={success}
            />

        </div>
    );
}

export default Auth;