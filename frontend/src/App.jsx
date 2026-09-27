import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import OnboardingGoal from "./pages/OnboardingGoal";
import GenderSelection from "./pages/GenderSelection";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Auth />} />

                <Route
                    path="/onboarding/goal"
                    element={<OnboardingGoal />}
                />

                <Route
                    path="/onboarding/gender"
                    element={<GenderSelection />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;