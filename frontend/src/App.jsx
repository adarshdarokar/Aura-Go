import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import OnboardingGoal from "./pages/OnboardingGoal";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route
                    path="/onboarding/goal"
                    element={<OnboardingGoal />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;