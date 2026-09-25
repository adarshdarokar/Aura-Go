function Button({
    children,
    variant = "primary",
    type = "button",
    className = "",
    ...props
}) {
    const baseStyles =
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary:
            "bg-white text-black hover:bg-gray-200",
        secondary:
            "border border-white/15 bg-white/5 text-white hover:bg-white/10",
        ghost:
            "bg-transparent text-white hover:bg-white/5"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;