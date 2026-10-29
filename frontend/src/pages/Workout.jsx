
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const initialForm = {
  name: "",
  description: "",
  difficulty: "intermediate",
  estimatedDuration: 60,
  status: "draft",
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

const getError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const normalizeWorkout = (workout) => ({
  ...workout,
  exercises: Array.isArray(workout?.exercises) ? workout.exercises : [],
});

function Icon({ children }) {
  return <span className="inline-flex w-5 justify-center">{children}</span>;
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}) {
  const styles = {
    primary: "bg-white text-black hover:bg-neutral-200",
    secondary: "bg-[#292929] text-neutral-200 hover:bg-[#353535]",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
    ghost: "bg-transparent text-neutral-400 hover:bg-[#2a2a2a] hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="text-sm font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#363636] bg-[#262626] px-3.5 py-3 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-neutral-500";

function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={cn(
          "my-auto max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-[#363636] bg-[#202020] shadow-2xl",
          wide ? "max-w-4xl" : "max-w-xl"
        )}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#363636] bg-[#202020] px-5 py-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg px-3 py-1.5 text-xl text-neutral-400 hover:bg-[#303030] hover:text-white"
          >
            ×
          </button>
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

function WorkoutFormModal({ workout, onClose, onSave, busy }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(workout || {}),
  }));

  const change = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      estimatedDuration: Number(form.estimatedDuration),
      status: form.status,
    });
  };

  return (
    <Modal
      title={workout ? "Edit workout" : "Create workout"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Workout name">
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="e.g. Push Day"
            required
            maxLength={100}
          />
        </Field>

        <Field label="Description">
          <textarea
            className={cn(inputClass, "min-h-24 resize-y")}
            value={form.description || ""}
            onChange={(e) => change("description", e.target.value)}
            placeholder="Chest, shoulders and triceps"
            maxLength={500}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Difficulty">
            <select
              className={inputClass}
              value={form.difficulty}
              onChange={(e) => change("difficulty", e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>

          <Field label="Duration (minutes)">
            <input
              type="number"
              min="1"
              max="600"
              className={inputClass}
              value={form.estimatedDuration}
              onChange={(e) => change("estimatedDuration", e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="Status">
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => change("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </Field>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy || !form.name.trim()}>
            {busy ? "Saving..." : workout ? "Save changes" : "Create workout"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ExerciseRow({
  item,
  index,
  editing,
  onEdit,
  onCancel,
  onSave,
  onRemove,
  busy,
}) {
  const exercise = item.exercise || {};
  const [form, setForm] = useState({
    sets: item.sets ?? 3,
    reps: item.reps ?? 12,
    weight: item.weight ?? 0,
    restTime: item.restTime ?? 60,
  });

  useEffect(() => {
    setForm({
      sets: item.sets ?? 3,
      reps: item.reps ?? 12,
      weight: item.weight ?? 0,
      restTime: item.restTime ?? 60,
    });
  }, [item.sets, item.reps, item.weight, item.restTime]);

  const change = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();

    const payload = {
      sets: Number(form.sets),
      reps: Number(form.reps),
      weight: Number(form.weight),
      restTime: Number(form.restTime),
    };

    if (
      !Number.isInteger(payload.sets) ||
      payload.sets < 1 ||
      !Number.isInteger(payload.reps) ||
      payload.reps < 1 ||
      !Number.isFinite(payload.weight) ||
      payload.weight < 0 ||
      !Number.isFinite(payload.restTime) ||
      payload.restTime < 0
    ) {
      return;
    }

    onSave(payload);
  };

  return (
    <article className="rounded-xl border border-[#363636] bg-[#242424] p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#333] text-sm font-bold text-neutral-200">
            {index + 1}
          </div>
          <div className="min-w-0">
            <h4 className="break-words font-semibold text-white">
              {exercise.name || "Exercise"}
            </h4>
            <p className="mt-1 text-xs text-neutral-500">
              {(exercise.primaryMuscles || []).join(", ") || "Strength"}
            </p>
            {!editing && (
              <p className="mt-2 text-sm text-neutral-400">
                {item.sets} sets × {item.reps} reps
                {" · "}
                {item.weight ?? 0} kg
                {" · "}
                {item.restTime ?? 60}s rest
              </p>
            )}
          </div>
        </div>

        {!editing && (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              onClick={onEdit}
              className="px-3 py-2"
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={onRemove}
              disabled={busy}
              className="px-3 py-2"
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      {editing && (
        <form
          onSubmit={submit}
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <Field label="Sets">
            <input
              className={inputClass}
              type="number"
              min="1"
              step="1"
              value={form.sets}
              onChange={(e) => change("sets", e.target.value)}
              required
            />
          </Field>
          <Field label="Reps">
            <input
              className={inputClass}
              type="number"
              min="1"
              step="1"
              value={form.reps}
              onChange={(e) => change("reps", e.target.value)}
              required
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.5"
              value={form.weight}
              onChange={(e) => change("weight", e.target.value)}
              required
            />
          </Field>
          <Field label="Rest (sec)">
            <input
              className={inputClass}
              type="number"
              min="0"
              step="1"
              value={form.restTime}
              onChange={(e) => change("restTime", e.target.value)}
              required
            />
          </Field>

          <div className="col-span-2 flex gap-2 sm:col-span-4 sm:justify-end">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save exercise"}
            </Button>
          </div>
        </form>
      )}
    </article>
  );
}

function ManageExercises({
  workout,
  onClose,
  onChanged,
  request,
  notify,
}) {
  const [library, setLibrary] = useState([]);
  const [search, setSearch] = useState("");
  const [addingId, setAddingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const [error, setError] = useState("");

  const exercises = workout.exercises || [];

  const loadLibrary = useCallback(async () => {
    setLoadingLibrary(true);
    setError("");

    try {
      const response = await request.get("/exercises");
      const items = response.data?.data?.exercises;

      if (!Array.isArray(items)) {
        throw new Error("Unexpected exercise library response");
      }

      setLibrary(items);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoadingLibrary(false);
    }
  }, [request]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const existingIds = new Set(
    exercises.map((item) => String(item.exercise?._id || item.exercise))
  );

  const filteredLibrary = library.filter((exercise) => {
    const text = `${exercise.name} ${(exercise.primaryMuscles || []).join(" ")}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const addExercise = async (exercise) => {
    if (existingIds.has(String(exercise._id))) {
      notify("This exercise is already in the workout.", "error");
      return;
    }

    setAddingId(exercise._id);
    setError("");

    try {
      const maxOrder = exercises.reduce(
        (max, item) => Math.max(max, Number(item.order) || 0),
        0
      );

      const payload = {
        exercise: exercise._id,
        sets: 3,
        reps: 12,
        weight: 0,
        restTime: 60,
        order: maxOrder + 1,
      };

      const response = await request.post(
        `/workouts/${workout._id}/exercises`,
        payload
      );

      const updatedWorkout = response.data?.data?.workout;
      if (!updatedWorkout) throw new Error("Updated workout was not returned");

      onChanged(normalizeWorkout(updatedWorkout));
      notify(`${exercise.name} added successfully.`);
    } catch (err) {
      setError(getError(err));
    } finally {
      setAddingId("");
    }
  };

  const removeExercise = async (item) => {
    const exerciseId = item.exercise?._id || item.exercise;
    if (!exerciseId) {
      notify("Exercise ID is missing.", "error");
      return;
    }

    if (!window.confirm(`Remove ${item.exercise?.name || "this exercise"}?`)) {
      return;
    }

    setBusyId(String(exerciseId));
    setError("");

    try {
      const response = await request.delete(
        `/workouts/${workout._id}/exercises/${exerciseId}`
      );

      const updatedWorkout = response.data?.data?.workout;
      if (!updatedWorkout) throw new Error("Updated workout was not returned");

      onChanged(normalizeWorkout(updatedWorkout));
      notify("Exercise removed.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId("");
    }
  };

  const updateExercise = async (item, values) => {
    const exerciseId = item.exercise?._id || item.exercise;
    if (!exerciseId) return;

    setBusyId(String(exerciseId));
    setError("");

    try {
      // Requires PATCH /workouts/:id/exercises/:exerciseId in the backend.
      const response = await request.patch(
        `/workouts/${workout._id}/exercises/${exerciseId}`,
        values
      );

      const updatedWorkout = response.data?.data?.workout;
      if (!updatedWorkout) throw new Error("Updated workout was not returned");

      onChanged(normalizeWorkout(updatedWorkout));
      setEditingId("");
      notify("Exercise settings saved.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId("");
    }
  };

  return (
    <Modal title={`Manage · ${workout.name}`} onClose={onClose} wide>
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-white">Workout exercises</h3>
            <span className="rounded-full bg-[#303030] px-3 py-1 text-xs text-neutral-300">
              {exercises.length} exercises
            </span>
          </div>

          {exercises.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#404040] px-4 py-8 text-center">
              <p className="font-medium text-neutral-300">No exercises yet</p>
              <p className="mt-1 text-sm text-neutral-500">
                Add exercises from the library below.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((item, index) => {
                const id = String(item.exercise?._id || item.exercise);
                return (
                  <ExerciseRow
                    key={id}
                    item={item}
                    index={index}
                    editing={editingId === id}
                    onEdit={() => setEditingId(id)}
                    onCancel={() => setEditingId("")}
                    onSave={(values) => updateExercise(item, values)}
                    onRemove={() => removeExercise(item)}
                    busy={busyId === id}
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="border-t border-[#363636] pt-5">
          <div className="mb-4">
            <h3 className="font-semibold text-white">Exercise library</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Select an exercise to add it to this workout.
            </p>
          </div>

          <input
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises or muscles..."
          />

          {loadingLibrary ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              Loading exercises...
            </p>
          ) : filteredLibrary.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              No exercises found.
            </p>
          ) : (
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
              {filteredLibrary.map((exercise) => {
                const alreadyAdded = existingIds.has(String(exercise._id));

                return (
                  <div
                    key={exercise._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#363636] bg-[#242424] p-3"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-neutral-100">
                        {exercise.name}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {(exercise.primaryMuscles || []).join(", ") ||
                          exercise.category ||
                          "Strength"}
                      </p>
                    </div>
                    <Button
                      variant={alreadyAdded ? "secondary" : "primary"}
                      disabled={alreadyAdded || addingId === exercise._id}
                      onClick={() => addExercise(exercise)}
                      className="shrink-0 px-3 py-2"
                    >
                      {alreadyAdded
                        ? "Added"
                        : addingId === exercise._id
                        ? "Adding..."
                        : "+ Add"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex justify-end border-t border-[#363636] pt-4">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function Workout() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formWorkout, setFormWorkout] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [manageWorkout, setManageWorkout] = useState(null);

  // Cookies are sent with requests. If your app uses a different axios
  // instance/interceptor, replace this with your existing instance.
  const request = useMemo(
    () =>
      axios.create({
        baseURL: API,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }),
    []
  );

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const loadWorkouts = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await request.get("/workouts");
      const items = response.data?.data?.workouts;

      if (!Array.isArray(items)) {
        throw new Error("Unexpected workouts response");
      }

      setWorkouts(items.map(normalizeWorkout));
    } catch (err) {
      setPageError(getError(err));
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesSearch = `${workout.name} ${workout.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "all" ||
        workout.difficulty === difficultyFilter;

      const matchesStatus =
        statusFilter === "all" || workout.status === statusFilter;

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [workouts, search, difficultyFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: workouts.length,
      active: workouts.filter((item) => item.status === "active").length,
      exercises: workouts.reduce(
        (total, item) => total + (item.exercises?.length || 0),
        0
      ),
      completed: workouts.filter((item) => item.status === "completed").length,
    }),
    [workouts]
  );

  const saveWorkout = async (payload) => {
    setSaving(true);
    setPageError("");

    try {
      const isEditing = Boolean(formWorkout?._id);

      const response = isEditing
        ? await request.patch(`/workouts/${formWorkout._id}`, payload)
        : await request.post("/workouts", payload);

      const updated = response.data?.data?.workout;
      if (!updated?._id) throw new Error("Workout was not returned");

      const normalized = normalizeWorkout(updated);

      setWorkouts((current) =>
        isEditing
          ? current.map((item) =>
              item._id === normalized._id ? normalized : item
            )
          : [normalized, ...current]
      );

      setShowForm(false);
      setFormWorkout(null);
      notify(isEditing ? "Workout updated." : "Workout created.");
    } catch (err) {
      setPageError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteWorkout = async (workout) => {
    if (!window.confirm(`Delete "${workout.name}" permanently?`)) return;

    setPageError("");

    try {
      await request.delete(`/workouts/${workout._id}`);
      setWorkouts((current) =>
        current.filter((item) => item._id !== workout._id)
      );

      if (manageWorkout?._id === workout._id) setManageWorkout(null);
      notify("Workout deleted.");
    } catch (err) {
      setPageError(getError(err));
    }
  };

  const syncManagedWorkout = (updatedWorkout) => {
    setManageWorkout(updatedWorkout);
    setWorkouts((current) =>
      current.map((item) =>
        item._id === updatedWorkout._id ? updatedWorkout : item
      )
    );
  };

  const openCreate = () => {
    setFormWorkout(null);
    setShowForm(true);
  };

  const openEdit = (workout) => {
    setFormWorkout(workout);
    setShowForm(true);
  };

  const statusStyle = {
    draft: "border-neutral-600 bg-neutral-700/30 text-neutral-300",
    active: "border-emerald-700/50 bg-emerald-500/10 text-emerald-300",
    completed: "border-blue-700/50 bg-blue-500/10 text-blue-300",
  };

  return (
    <main className="min-h-screen bg-[#171717] px-4 py-6 text-neutral-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
              AURA GO · TRAINING
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Workout Plans
            </h1>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">
              Build your training routine, organize exercises, and manage every
              workout in one place.
            </p>
          </div>

          <Button onClick={openCreate} className="self-start sm:self-auto">
            <Icon>＋</Icon> Create workout
          </Button>
        </header>

        {pageError && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 sm:flex-row sm:items-center">
            <p className="break-words text-sm text-red-300">{pageError}</p>
            <Button
              variant="secondary"
              onClick={loadWorkouts}
              className="shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total workouts", value: stats.total, icon: "▤" },
            { label: "Active plans", value: stats.active, icon: "↗" },
            { label: "Total exercises", value: stats.exercises, icon: "◈" },
            { label: "Completed plans", value: stats.completed, icon: "✓" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#363636] bg-[#202020] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-neutral-400 sm:text-sm">
                  {stat.label}
                </p>
                <span className="text-lg text-neutral-500">{stat.icon}</span>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-[#363636] bg-[#202020] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                ⌕
              </span>
              <input
                className={cn(inputClass, "pl-10")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search workout plans..."
              />
            </div>

            <select
              className={inputClass}
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              aria-label="Filter by difficulty"
            >
              <option value="all">All difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              className={inputClass}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Your workouts</h2>
            <span className="text-sm text-neutral-500">
              {filteredWorkouts.length} found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-[#363636] bg-[#202020]"
                />
              ))}
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#404040] bg-[#202020] px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#303030] text-2xl">
                ◈
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">
                {workouts.length === 0
                  ? "Create your first workout"
                  : "No workouts found"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
                {workouts.length === 0
                  ? "Start with a workout plan and add exercises from your library."
                  : "Try changing your search or filters."}
              </p>
              {workouts.length === 0 && (
                <Button onClick={openCreate} className="mt-5">
                  Create workout
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorkouts.map((workout) => (
                <article
                  key={workout._id}
                  className="flex min-w-0 flex-col rounded-2xl border border-[#363636] bg-[#202020] p-5 transition hover:border-[#505050]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3a3a3a] bg-[#292929] text-xl">
                      ◈
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium capitalize",
                        statusStyle[workout.status] || statusStyle.draft
                      )}
                    >
                      {workout.status || "draft"}
                    </span>
                  </div>

                  <h3 className="mt-5 break-words text-xl font-bold text-white">
                    {workout.name}
                  </h3>
                  <p className="mt-2 min-h-10 break-words text-sm leading-6 text-neutral-400">
                    {workout.description || "No description added."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-[#2b2b2b] px-2.5 py-1.5 text-xs capitalize text-neutral-300">
                      {workout.difficulty || "intermediate"}
                    </span>
                    <span className="rounded-lg bg-[#2b2b2b] px-2.5 py-1.5 text-xs text-neutral-300">
                      ◷ {workout.estimatedDuration || 0} min
                    </span>
                    <span className="rounded-lg bg-[#2b2b2b] px-2.5 py-1.5 text-xs text-neutral-300">
                      ◈ {workout.exercises.length} exercises
                    </span>
                  </div>

                  <div className="mt-5 flex-1 border-t border-[#363636] pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Included exercises
                    </p>

                    {workout.exercises.length === 0 ? (
                      <p className="text-sm text-neutral-500">
                        No exercises added yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {workout.exercises.slice(0, 3).map((item, index) => (
                          <div
                            key={
                              item.exercise?._id ||
                              item.exercise ||
                              `${workout._id}-${index}`
                            }
                            className="flex min-w-0 items-center gap-2 text-sm"
                          >
                            <span className="text-neutral-600">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate text-neutral-300">
                              {item.exercise?.name || "Exercise"}
                            </span>
                          </div>
                        ))}
                        {workout.exercises.length > 3 && (
                          <p className="text-xs text-neutral-500">
                            +{workout.exercises.length - 3} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setManageWorkout(workout)}
                    >
                      <Icon>☷</Icon> Manage
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => openEdit(workout)}
                    >
                      <Icon>✎</Icon> Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteWorkout(workout)}
                      className="col-span-2"
                    >
                      <Icon>⌫</Icon> Delete workout
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-[#303030] py-5 text-center text-xs text-neutral-600">
          AURA GO · Workout management
        </footer>
      </div>

      {showForm && (
        <WorkoutFormModal
          workout={formWorkout}
          onClose={() => {
            setShowForm(false);
            setFormWorkout(null);
          }}
          onSave={saveWorkout}
          busy={saving}
        />
      )}

      {manageWorkout && (
        <ManageExercises
          workout={manageWorkout}
          onClose={() => setManageWorkout(null)}
          onChanged={syncManagedWorkout}
          request={request}
          notify={notify}
        />
      )}

      {toast && (
        <div
          role="status"
          className={cn(
            "fixed bottom-5 right-4 z-[60] max-w-[calc(100vw-2rem)] rounded-xl border px-4 py-3 text-sm shadow-2xl sm:right-6",
            toast.type === "error"
              ? "border-red-500/30 bg-[#291b1b] text-red-300"
              : "border-[#484848] bg-[#252525] text-neutral-100"
          )}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
