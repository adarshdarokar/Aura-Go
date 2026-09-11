const getCookieOptions = (isProduction, maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge
});

const setAuthCookies = (res, accessToken, refreshToken) => {
    const isProduction =
        process.env.NODE_ENV === "production";

    res.cookie(
        "accessToken",
        accessToken,
        getCookieOptions(
            isProduction,
            15 * 60 * 1000
        )
    );

    res.cookie(
        "refreshToken",
        refreshToken,
        getCookieOptions(
            isProduction,
            7 * 24 * 60 * 60 * 1000
        )
    );
};

const clearAuthCookies = (res) => {
    const isProduction =
        process.env.NODE_ENV === "production";

    const clearOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/"
    };

    res.clearCookie(
        "accessToken",
        clearOptions
    );

    res.clearCookie(
        "refreshToken",
        clearOptions
    );
};

module.exports = {
    setAuthCookies,
    clearAuthCookies
};