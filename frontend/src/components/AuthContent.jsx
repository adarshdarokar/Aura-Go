import Button from "./Button";
import Input from "./Input";

function AuthContent({
    isLogin,
    setMode,
    mobile = false,
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    success
}) {
    return (
        <>
            {/* Heading */}
            <div
                className={
                    mobile
                        ? "mb-3"
                        : "mb-6"
                }
            >
                <p
                    className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.30em]
                        text-[#d9b996]/[0.82]
                    "
                >
                    {isLogin
                        ? "WELCOME BACK"
                        : "CREATE ACCOUNT"}
                </p>

                <h1
                    className="
                        mt-1.5
                        text-[25px]
                        font-extrabold
                        leading-none
                        tracking-[-0.045em]
                        text-[#fff8ef]

                        md:mt-2
                        md:text-[27px]
                    "
                >
                    {isLogin
                        ? "Sign in"
                        : "Get started"}
                </h1>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className={
                    mobile
                        ? "space-y-2.5"
                        : "space-y-4"
                }
            >
                {/* Full name */}
                {!isLogin && (
                    <Input
                        label="Full name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                    />
                )}

                {/* Email */}
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                />

                {/* Password */}
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                />

                {/* Confirm password */}
                {!isLogin && (
                    <Input
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
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

                                text-[9px]

                                text-[#d8bea2]/[0.76]
                            "
                        >
                            <input
                                type="checkbox"
                                disabled={loading}
                                className="
                                    h-3
                                    w-3
                                    shrink-0
                                    accent-[#cba77f]

                                    md:h-3.5
                                    md:w-3.5
                                "
                            />

                            <span>
                                Remember me
                            </span>
                        </label>

                        <button
                            type="button"
                            disabled={loading}
                            className="
                                shrink-0

                                text-[9px]

                                text-[#d8bea2]/[0.82]

                                transition-colors

                                hover:text-[#fff8ef]

                                disabled:opacity-50
                            "
                        >
                            Forgot password?
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p
                        className="
                            rounded-lg
                            border
                            border-red-300/10
                            bg-red-400/10
                            px-3
                            py-2
                            text-[10px]
                            leading-relaxed
                            text-red-200
                        "
                    >
                        {error}
                    </p>
                )}

                {/* Success */}
                {success && (
                    <p
                        className="
                            rounded-lg
                            border
                            border-green-300/10
                            bg-green-400/10
                            px-3
                            py-2
                            text-[10px]
                            leading-relaxed
                            text-green-200
                        "
                    >
                        {success}
                    </p>
                )}

                {/* Submit button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="
                        mt-1

                        h-10
                        w-full

                        rounded-xl

                        !border
                        !border-[#f5e5d3]/[0.28]

                        !bg-[#e1cdb7]

                        !text-[#2a1d15]

                        text-[12px]
                        font-medium

                        shadow-[0_8px_25px_rgba(20,10,5,0.18)]

                        transition-all
                        duration-200

                        hover:!bg-[#f0e2d2]

                        active:scale-[0.99]

                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        md:h-11
                        md:text-[13px]
                    "
                >
                    {loading
                        ? isLogin
                            ? "Signing in..."
                            : "Creating account..."
                        : isLogin
                            ? "Sign in"
                            : "Create account"}
                </Button>
            </form>

            {/* Login / Signup switch */}
            <div
                className="
                    mt-3

                    border-t
                    border-[#dcb995]/[0.14]

                    pt-3

                    text-center
                    text-[9px]

                    text-[#d6baa0]/[0.72]

                    md:mt-5
                    md:pt-4
                    md:text-[10px]
                "
            >
                {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}

                <button
                    type="button"
                    disabled={loading}
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

                        disabled:opacity-50
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

export default AuthContent;