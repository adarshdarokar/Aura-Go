
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

const emptyForm = {
  mealType: "breakfast",
  mealName: "",
  calories: "",
  protein: "",
  carbohydrates: "",
  fiber: "",
};

const inputClass =
  "h-12 w-full rounded-xl border border-[#626262]/30 bg-[#171717] px-4 text-sm text-[#EDEDED] outline-none focus:border-[#B4B4B4]/60";

const labelClass =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858585]";

function Nutrition() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState("100");
  const [mealType, setMealType] = useState("breakfast");
  const [nutrition, setNutrition] = useState(null);
  const [summary, setSummary] = useState(null);
  const [targets, setTargets] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [manual, setManual] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const requestConfig = { withCredentials: true };

  const loadDashboard = useCallback(async () => {
    try {
      const [summaryResponse, targetsResponse, mealsResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/nutrition/summary?date=${today}`,
            requestConfig
          ),
          axios.get(`${API_URL}/nutrition/targets`, requestConfig),
          axios.get(
            `${API_URL}/nutrition?date=${today}`,
            requestConfig
          ),
        ]);

      setSummary(summaryResponse.data.data.summary);
      setTargets(targetsResponse.data.data.targets);
      setTodayMeals(mealsResponse.data.data.nutrition);
    } catch (err) {
      console.error("Nutrition dashboard error:", err);
      setError(
        err.response?.data?.message ||
          "Could not load nutrition data. Please log in again if needed."
      );
    }
  }, [today]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setFoods([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/foods?q=${encodeURIComponent(search.trim())}&limit=20`
        );
        setFoods(response.data.data.foods || []);
      } catch (err) {
        console.error("Food search error:", err);
        setError(err.response?.data?.message || "Food search failed.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const calculateFood = async () => {
    if (!selectedFood) {
      setError("Select a food first.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Enter a quantity greater than zero.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/foods/calculate`,
        {
          foodId: selectedFood._id,
          quantity: Number(quantity),
        }
      );

      setNutrition(response.data.data.nutrition);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not calculate nutrition."
      );
    } finally {
      setLoading(false);
    }
  };

  const addSelectedFood = async () => {
    if (!selectedFood || !nutrition) {
      setError("Select a food and calculate its nutrition first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await axios.post(
        `${API_URL}/nutrition/food`,
        {
          foodId: selectedFood._id,
          quantity: Number(quantity),
          mealType,
          date: today,
        },
        requestConfig
      );

      setSuccess("Food added to today's nutrition log.");
      setSearch("");
      setFoods([]);
      setSelectedFood(null);
      setNutrition(null);
      setQuantity("100");

      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add food.");
    } finally {
      setSaving(false);
    }
  };

  const updateManualField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const addManualMeal = async (event) => {
    event.preventDefault();

    const { mealType: type, mealName, calories, protein, carbohydrates, fiber } =
      formData;

    if (
      !type ||
      !mealName.trim() ||
      [calories, protein, carbohydrates, fiber].some(
        (value) => value === "" || !Number.isFinite(Number(value)) || Number(value) < 0
      )
    ) {
      setError("Fill all fields with valid non-negative numbers.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await axios.post(
        `${API_URL}/nutrition`,
        {
          date: new Date(`${today}T12:00:00+05:30`).toISOString(),
          mealType: type,
          mealName: mealName.trim(),
          calories: Number(calories),
          protein: Number(protein),
          carbohydrates: Number(carbohydrates),
          fiber: Number(fiber),
        },
        requestConfig
      );

      setSuccess("Meal saved successfully.");
      setFormData(emptyForm);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save meal.");
    } finally {
      setSaving(false);
    }
  };

  const remaining = (target, consumed) =>
    Math.round((Number(target || 0) - Number(consumed || 0)) * 10) / 10;

  return (
    <main className="min-h-screen bg-[#0E0E0E] px-5 py-7 text-[#EDEDED] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#777]">
            AURA GO / DAILY TRACKER
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Nutrition
          </h1>
          <p className="mt-2 text-sm text-[#858585]">
            Track your food, macros and daily targets.
          </p>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Calories"
            value={`${Math.round(summary?.calories || 0)}`}
            unit="kcal consumed"
            remaining={targets ? remaining(targets.calories, summary?.calories) : null}
          />
          <MetricCard
            label="Protein"
            value={`${Math.round(summary?.protein || 0)} g`}
            unit="consumed"
            remaining={targets ? remaining(targets.protein, summary?.protein) : null}
          />
          <MetricCard
            label="Carbohydrates"
            value={`${Math.round(summary?.carbohydrates || 0)} g`}
            unit="consumed today"
          />
          <MetricCard
            label="Fiber"
            value={`${Math.round(summary?.fiber || 0)} g`}
            unit="consumed today"
          />
        </section>

        {targets && (
          <section className="mb-8 rounded-2xl border border-[#626262]/30 bg-[#626262]/[0.07] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Daily targets</h2>
              <span className="text-xs text-[#858585]">Calculated from your profile</span>
            </div>
            <TargetBar
              label="Calories"
              consumed={summary?.calories || 0}
              target={targets.calories}
              unit="kcal"
            />
            <TargetBar
              label="Protein"
              consumed={summary?.protein || 0}
              target={targets.protein}
              unit="g"
            />
          </section>
        )}

        <section className="mb-8 rounded-2xl border border-[#626262]/30 bg-[#626262]/[0.07] p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#777]">
              Food database
            </p>
            <h2 className="mt-1 text-xl font-semibold">Add food</h2>
            <p className="mt-1 text-sm text-[#858585]">
              Search a food, enter its quantity and calculate its macros.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_180px]">
            <div>
              <label className={labelClass}>Search food</label>
              <input
                className={inputClass}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedFood(null);
                  setNutrition(null);
                }}
                placeholder="Try rice, oats, egg, paneer..."
              />

              {loading && (
                <p className="mt-2 text-xs text-[#858585]">Searching...</p>
              )}

              {foods.length > 0 && (
                <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#626262]/30 bg-[#171717]">
                  {foods.map((food) => (
                    <button
                      type="button"
                      key={food._id}
                      onClick={() => {
                        setSelectedFood(food);
                        setSearch(food.name);
                        setFoods([]);
                        setNutrition(null);
                        setError("");
                      }}
                      className="flex w-full items-center justify-between gap-3 border-b border-[#626262]/15 px-4 py-3 text-left last:border-0 hover:bg-white/[0.05]"
                    >
                      <span className="text-sm">{food.name}</span>
                      <span className="shrink-0 text-xs text-[#858585]">
                        {food.caloriesPer100g} kcal / 100 g
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {selectedFood && (
                <p className="mt-2 text-xs text-emerald-300">
                  Selected: {selectedFood.name}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Quantity ({selectedFood?.servingUnit || "g"})
              </label>
              <input
                type="number"
                min="1"
                step="1"
                className={inputClass}
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  setNutrition(null);
                }}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Meal type</label>
              <select
                className={inputClass}
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
              >
                {mealTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={calculateFood}
                disabled={loading || !selectedFood}
                className="h-12 w-full rounded-xl border border-[#626262]/40 bg-[#242424] text-sm font-semibold transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Calculate nutrition
              </button>
            </div>
          </div>

          {nutrition && (
            <div className="mt-5 rounded-xl border border-[#626262]/25 bg-[#0E0E0E] p-4">
              <p className="mb-4 text-sm font-semibold">
                Estimated nutrition · {quantity} {selectedFood?.servingUnit}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <NutritionValue label="Calories" value={nutrition.calories} unit="kcal" />
                <NutritionValue label="Protein" value={nutrition.protein} unit="g" />
                <NutritionValue label="Carbs" value={nutrition.carbohydrates} unit="g" />
                <NutritionValue label="Fiber" value={nutrition.fiber} unit="g" />
              </div>
              <button
                type="button"
                onClick={addSelectedFood}
                disabled={saving}
                className="mt-5 h-12 w-full rounded-xl bg-[#EDEDED] text-sm font-semibold text-[#0E0E0E] transition hover:bg-[#C0C1C1] disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add to today's log →"}
              </button>
            </div>
          )}
        </section>

        <section className="mb-8 rounded-2xl border border-[#626262]/30 bg-[#626262]/[0.07] p-5 sm:p-7">
          <button
            type="button"
            onClick={() => setManual((previous) => !previous)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#777]">
                Optional
              </p>
              <h2 className="mt-1 text-lg font-semibold">Manual meal entry</h2>
            </div>
            <span className="text-sm text-[#858585]">{manual ? "−" : "+"}</span>
          </button>

          {manual && (
            <form onSubmit={addManualMeal} className="mt-6 space-y-4">
              <div>
                <label className={labelClass}>Meal type</label>
                <select
                  className={inputClass}
                  value={formData.mealType}
                  onChange={(event) => updateManualField("mealType", event.target.value)}
                >
                  <option value="">Select meal</option>
                  {mealTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Meal name</label>
                <input
                  className={inputClass}
                  value={formData.mealName}
                  onChange={(event) => updateManualField("mealName", event.target.value)}
                  placeholder="Describe your meal"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["calories", "Calories (kcal)"],
                  ["protein", "Protein (g)"],
                  ["carbohydrates", "Carbs (g)"],
                  ["fiber", "Fiber (g)"],
                ].map(([field, title]) => (
                  <div key={field}>
                    <label className={labelClass}>{title}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className={inputClass}
                      value={formData[field]}
                      onChange={(event) => updateManualField(field, event.target.value)}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="h-12 w-full rounded-xl bg-[#EDEDED] text-sm font-semibold text-[#0E0E0E] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save manual meal"}
              </button>
            </form>
          )}
        </section>

        <section className="rounded-2xl border border-[#626262]/30 bg-[#626262]/[0.07] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#777]">
                {today}
              </p>
              <h2 className="mt-1 text-xl font-semibold">Today's meals</h2>
            </div>
            <button
              type="button"
              onClick={loadDashboard}
              className="text-xs text-[#B4B4B4] hover:text-white"
            >
              Refresh
            </button>
          </div>

          {todayMeals.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#626262]/30 p-6 text-center text-sm text-[#858585]">
              No meals logged for today yet.
            </p>
          ) : (
            <div className="space-y-3">
              {todayMeals.map((meal) => (
                <article
                  key={meal._id}
                  className="flex flex-col gap-3 rounded-xl border border-[#626262]/20 bg-[#0E0E0E] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{meal.mealName}</p>
                    <p className="mt-1 text-xs capitalize text-[#858585]">
                      {meal.mealType} · {new Date(meal.date).toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-xs text-[#B4B4B4] sm:text-right">
                    <span>{meal.calories} kcal</span>
                    <span>{meal.protein} g protein</span>
                    <span>{meal.carbohydrates} g carbs</span>
                    <span>{meal.fiber} g fiber</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value, unit, remaining }) {
  return (
    <article className="rounded-2xl border border-[#626262]/30 bg-[#626262]/[0.07] p-5">
      <p className="text-xs text-[#858585]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-[#777]">{unit}</p>
      {remaining !== null && remaining !== undefined && (
        <p className={`mt-3 text-xs ${remaining < 0 ? "text-amber-300" : "text-emerald-300"}`}>
          {remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over target`}
        </p>
      )}
    </article>
  );
}

function TargetBar({ label, consumed, target, unit }) {
  const safeTarget = Number(target) || 0;
  const amount = Number(consumed) || 0;
  const percentage = safeTarget > 0 ? Math.min((amount / safeTarget) * 100, 100) : 0;
  const left = Math.round((safeTarget - amount) * 10) / 10;

  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="text-[#858585]">
          {Math.round(amount)} / {safeTarget} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#626262]/30">
        <div
          className="h-full rounded-full bg-[#EDEDED] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[#777]">
        {left >= 0 ? `${left} ${unit} remaining` : `${Math.abs(left)} ${unit} over target`}
      </p>
    </div>
  );
}

function NutritionValue({ label, value, unit }) {
  return (
    <div>
      <p className="text-xs text-[#858585]">{label}</p>
      <p className="mt-1 text-lg font-semibold">
        {value} <span className="text-xs font-normal text-[#858585]">{unit}</span>
      </p>
    </div>
  );
}

export default Nutrition;
