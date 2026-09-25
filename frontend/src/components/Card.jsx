function Card({
    children,
    className = "",
    padding = "p-5"
}) {
    return (
        <div
            className={`
                rounded-3xl
                border border-white/10
                bg-white/[0.04]
                backdrop-blur-xl
                shadow-[0_8px_30px_rgba(0,0,0,0.18)]
                ${padding}
                ${className}
            `}
        >
            {children}
        </div>
    );
}

export default Card;