import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import OnboardingGoal from "./pages/OnboardingGoal";
import GenderSelection from "./pages/GenderSelection";
import ProfileDetails from "./pages/ProfileDetails";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Auth */}
                <Route
                    path="/"
                    element={<Auth />}
                />

                {/* Onboarding */}
                <Route
                    path="/onboarding/goal"
                    element={<OnboardingGoal />}
                />

                <Route
                    path="/onboarding/gender"
                    element={<GenderSelection />}
                />

                <Route
                    path="/onboarding/profile"
                    element={<ProfileDetails />}
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;