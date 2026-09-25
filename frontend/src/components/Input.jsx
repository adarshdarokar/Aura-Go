function Input({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    name,
    error,
    ...props
}) {
    return (
        <div className="w-full">

            {/* Label */}

            {label && (
                <label
                    htmlFor={name}
                    className="
                        mb-1.5
                        block
                        text-[10px]
                        font-medium
                        tracking-[0.01em]
                        text-[#d9b996]/[0.86]
                    "
                >
                    {label}
                </label>
            )}


            {/* Input */}

            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="
                    h-11
                    w-full

                    rounded-[11px]

                    border
                    border-[#d7b692]/[0.18]

                    bg-[#211711]/[0.25]

                    px-3.5

                    text-[13px]
                    text-[#fff7ed]

                    outline-none

                    placeholder:text-[#d6b89b]/[0.42]

                    shadow-[inset_0_1px_0_rgba(255,239,219,0.035)]

                    transition-all
                    duration-200

                    focus:border-[#e5c5a4]/[0.38]

                    focus:bg-[#211711]/[0.32]

                    focus:ring-1
                    focus:ring-[#e2bd97]/[0.10]
                "
                {...props}
            />


            {/* Error */}

            {error && (
                <p className="mt-1.5 text-xs text-red-300">
                    {error}
                </p>
            )}

        </div>
    );
}

export default Input;