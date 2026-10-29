import { BrowserRouter, Routes, Route } from "react-router-dom";
import Workout from "./pages/Workout";
import Auth from "./pages/Auth";
import OnboardingGoal from "./pages/OnboardingGoal";
import GenderSelection from "./pages/GenderSelection";
import ProfileDetails from "./pages/ProfileDetails";
import Dashboard from "./pages/Dashboard";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Auth />} />

        {/* Onboarding */}
        <Route path="/onboarding/goal" element={<OnboardingGoal />} />

        <Route path="/onboarding/gender" element={<GenderSelection />} />

        <Route path="/onboarding/profile" element={<ProfileDetails />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/workout" element={<Workout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
