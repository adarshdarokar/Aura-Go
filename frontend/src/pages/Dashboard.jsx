import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const quickActions = [
  {
    id: "workout",
    number: "01",
    title: "Start Workout",
    description: "Begin today's training session.",
  },
  {
    id: "nutrition",
    number: "02",
    title: "Log Nutrition",
    description: "Track your meals and macros.",
  },
  {
    id: "progress",
    number: "03",
    title: "View Progress",
    description: "Check your latest fitness progress.",
  },
];

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = () => {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const [user, setUser] = useState(null);

  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fiber: 0,
    totalMeals: 0,
  });

  const [loading, setLoading] = useState(true);
  const [nutritionLoading, setNutritionLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setNutritionLoading(true);
        setError("");

        const today = getTodayDate();

        const [profileResponse, nutritionResponse] = await Promise.all([
          axios.get(`${API_URL}/auth/me`, {
            withCredentials: true,
          }),

          axios.get(`${API_URL}/nutrition/summary?date=${today}`, {
            withCredentials: true,
          }),
        ]);

        if (profileResponse.data?.success) {
          setUser(profileResponse.data.data.user);
        }

        if (nutritionResponse.data?.success) {
          setNutrition(nutritionResponse.data.data.summary);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        setError(
          error.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
        setNutritionLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getUserName = () => {
    if (!user) {
      return "there";
    }

    return user.name || user.fullName || user.username || "there";
  };

  const getInitials = () => {
    const name = getUserName();

    if (!name || name === "there") {
      return "AD";
    }

    const words = name.trim().split(" ");

    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const stats = [
    {
      label: "Calories",
      value: nutritionLoading ? "..." : nutrition.calories.toLocaleString(),
      target: "3,000",
      unit: "kcal",
    },
    {
      label: "Protein",
      value: nutritionLoading
        ? "..."
        : Math.round(nutrition.protein).toString(),
      target: "140",
      unit: "g",
    },
    {
      label: "Workout",
      value: "42",
      target: "60",
      unit: "min",
    },
  ];

  return (
    <main
      className="
                relative
                min-h-[100dvh]
                overflow-x-hidden
                bg-[#0E0E0E]
                font-sans
                text-[#EDEDED]
            "
    >
      {/* Ambient background */}
      <div
        className="
                    pointer-events-none
                    fixed
                    inset-0
                    bg-[radial-gradient(circle_at_85%_5%,rgba(180,180,180,0.08),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(98,98,98,0.08),transparent_30%)]
                "
      />

      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between">
          <div>
            <p
              className="
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.34em]
                                text-[#626262]
                            "
            >
              AURA GO
            </p>

            <h1
              className="
                                mt-1.5
                                text-[24px]
                                font-semibold
                                tracking-[-0.04em]
                                text-[#EDEDED]
                                sm:text-[28px]
                            "
            >
              {loading ? "Loading..." : `Good evening, ${getUserName()}.`}
            </h1>

            {error && <p className="mt-2 text-[8px] text-red-400">{error}</p>}
          </div>

          {/* Profile */}
          <button
            type="button"
            className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#626262]/[0.35]
                            bg-[#626262]/[0.12]
                            text-[11px]
                            font-semibold
                            text-[#B4B4B4]
                            transition-all
                            duration-300
                            hover:border-[#B4B4B4]/[0.45]
                            hover:bg-[#626262]/[0.18]
                        "
          >
            {loading ? "..." : getInitials()}
          </button>
        </header>

        {/* Main Hero */}
        <section
          className="
                        relative
                        mt-7
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-[#626262]/[0.30]
                        bg-[#626262]/[0.10]
                        p-6
                        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                        sm:p-8
                    "
        >
          <div
            className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-[linear-gradient(120deg,rgba(237,237,237,0.04),transparent_55%)]
                        "
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#B4B4B4]" />

              <p
                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.3em]
                                    text-[#B4B4B4]
                                "
              >
                Today's focus
              </p>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <div>
                <h2
                  className="
                                        max-w-[520px]
                                        text-[29px]
                                        font-semibold
                                        leading-[1.02]
                                        tracking-[-0.045em]
                                        text-[#EDEDED]
                                        sm:text-[38px]
                                    "
                >
                  Build consistency.
                  <br />
                  <span className="text-[#626262]">One day at a time.</span>
                </h2>

                <p
                  className="
                                        mt-4
                                        max-w-[430px]
                                        text-[10px]
                                        leading-[1.7]
                                        text-[#B4B4B4]
                                    "
                >
                  Stay on track with your training, nutrition and recovery
                  today.
                </p>
              </div>

              <button
                type="button"
                className="
                                    h-[48px]
                                    shrink-0
                                    rounded-[14px]
                                    bg-[#EDEDED]
                                    px-6
                                    text-[11px]
                                    font-semibold
                                    text-[#0E0E0E]
                                    shadow-[0_12px_30px_rgba(0,0,0,0.25)]
                                    transition-all
                                    duration-300
                                    hover:bg-[#C0C1C1]
                                    active:scale-[0.98]
                                "
              >
                Start Workout →
              </button>
            </div>
          </div>
        </section>

        {/* Daily Overview */}
        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p
                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.28em]
                                    text-[#626262]
                                "
              >
                Daily overview
              </p>

              <h2
                className="
                                    mt-1.5
                                    text-[17px]
                                    font-semibold
                                    tracking-[-0.025em]
                                    text-[#EDEDED]
                                "
              >
                Today's activity
              </h2>
            </div>

            <span
              className="
                                text-[8px]
                                uppercase
                                tracking-[0.18em]
                                text-[#626262]
                            "
            >
              {formatDate()}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => {
              const numericValue =
                Number(String(stat.value).replace(",", "")) || 0;

              const numericTarget = Number(stat.target.replace(",", ""));

              const percentage = Math.min(
                (numericValue / numericTarget) * 100,
                100,
              );

              return (
                <div
                  key={stat.label}
                  className="
                                        rounded-[19px]
                                        border
                                        border-[#626262]/[0.28]
                                        bg-[#626262]/[0.10]
                                        p-5
                                        transition-all
                                        duration-300
                                        hover:border-[#B4B4B4]/[0.30]
                                        hover:bg-[#626262]/[0.14]
                                    "
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="
                                                text-[8px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.22em]
                                                text-[#626262]
                                            "
                    >
                      {stat.label}
                    </p>

                    <span className="text-[8px] text-[#626262]">
                      {stat.target} {stat.unit}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end gap-1.5">
                    <span
                      className="
                                                text-[26px]
                                                font-semibold
                                                tracking-[-0.04em]
                                                text-[#EDEDED]
                                            "
                    >
                      {stat.value}
                    </span>

                    <span className="mb-1 text-[8px] uppercase text-[#626262]">
                      {stat.unit}
                    </span>
                  </div>

                  <div className="mt-4 h-[4px] overflow-hidden rounded-full bg-[#626262]/[0.18]">
                    <div
                      className="
                                                h-full
                                                rounded-full
                                                bg-[#B4B4B4]
                                                transition-all
                                                duration-700
                                            "
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <div className="mb-4">
            <p
              className="
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-[#626262]
                            "
            >
              Quick actions
            </p>

            <h2
              className="
                                mt-1.5
                                text-[17px]
                                font-semibold
                                tracking-[-0.025em]
                                text-[#EDEDED]
                            "
            >
              Keep moving
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  if (action.id === "nutrition") {
                    navigate("/nutrition");
                  }
                }}
                className="
                                    group
                                    rounded-[19px]
                                    border
                                    border-[#626262]/[0.28]
                                    bg-[#626262]/[0.08]
                                    p-5
                                    text-left
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:border-[#B4B4B4]/[0.35]
                                    hover:bg-[#626262]/[0.14]
                                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-[10px]
                                            border
                                            border-[#626262]/[0.30]
                                            bg-[#0E0E0E]/[0.30]
                                            text-[8px]
                                            font-semibold
                                            tracking-[0.08em]
                                            text-[#B4B4B4]
                                        "
                  >
                    {action.number}
                  </span>

                  <span
                    className="
                                            text-[15px]
                                            text-[#626262]
                                            transition-all
                                            duration-300
                                            group-hover:translate-x-1
                                            group-hover:text-[#B4B4B4]
                                        "
                  >
                    →
                  </span>
                </div>

                <h3
                  className="
                                        mt-5
                                        text-[13px]
                                        font-semibold
                                        text-[#EDEDED]
                                    "
                >
                  {action.title}
                </h3>

                <p
                  className="
                                        mt-1.5
                                        text-[9px]
                                        leading-[1.6]
                                        text-[#626262]
                                    "
                >
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Bottom Navigation */}
        <nav
          className="
                        mt-9
                        flex
                        items-center
                        justify-center
                        gap-1
                        rounded-[18px]
                        border
                        border-[#626262]/[0.25]
                        bg-[#626262]/[0.08]
                        p-1.5
                    "
        >
          {[
            ["home", "Home"],
            ["workout", "Workout"],
            ["nutrition", "Nutrition"],
            ["progress", "Progress"],
          ].map(([id, label]) => {
            const isActive = activeTab === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`
                                    flex
                                    h-10
                                    flex-1
                                    items-center
                                    justify-center
                                    rounded-[12px]
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    transition-all
                                    duration-300

                                    ${
                                      isActive
                                        ? "bg-[#EDEDED] text-[#0E0E0E]"
                                        : "text-[#626262] hover:text-[#B4B4B4]"
                                    }
                                `}
              >
                {label}
              </button>
            );
          })}
        </nav>

        <p
          className="
                        mt-5
                        pb-3
                        text-center
                        text-[7px]
                        uppercase
                        tracking-[0.28em]
                        text-[#626262]
                    "
        >
          AURA GO • Your journey starts here
        </p>
      </div>
    </main>
  );
}

export default Dashboard;
