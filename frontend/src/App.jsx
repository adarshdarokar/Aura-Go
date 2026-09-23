import { maleTheme, femaleTheme } from "./theme/themes";

function App() {
    const theme = maleTheme;

    return (
        <div
            style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                minHeight: "100vh"
            }}
        >
            <h1
                style={{
                    color: theme.colors.primary
                }}
            >
                AURA GO
            </h1>

            <p
                style={{
                    color: theme.colors.textSecondary
                }}
            >
                Fitness. Strength. Progress.
            </p>
        </div>
    );
}

export default App;