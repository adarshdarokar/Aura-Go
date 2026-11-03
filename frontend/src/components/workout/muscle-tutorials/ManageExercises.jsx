import { useCallback, useEffect, useState } from "react";
import ExerciseRow from "./ExerciseRow";
import {
  getError,
  normalizeWorkout,
  inputClass,
} from "./workoutHelpers";

function ManageExercises({
  workout,
  onClose,
  onChanged,
  request,
  notify,
  onOpenMuscleTutorial,
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
    exercises.map((item) =>
      String(item.exercise?._id || item.exercise)
    )
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

      const response = await request.post(
        `/workouts/${workout._id}/exercises`,
        {
          exercise: exercise._id,
          sets: 3,
          reps: 12,
          weight: 0,
          restTime: 60,
          order: maxOrder + 1,
        }
      );

      const updatedWorkout = response.data?.data?.workout;

      if (!updatedWorkout) {
        throw new Error("Updated workout was not returned");
      }

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

    if (
      !window.confirm(
        `Remove ${item.exercise?.name || "this exercise"}?`
      )
    ) {
      return;
    }

    setBusyId(String(exerciseId));
    setError("");

    try {
      const response = await request.delete(
        `/workouts/${workout._id}/exercises/${exerciseId}`
      );

      const updatedWorkout = response.data?.data?.workout;

      if (!updatedWorkout) {
        throw new Error("Updated workout was not returned");
      }

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
      const response = await request.patch(
        `/workouts/${workout._id}/exercises/${exerciseId}`,
        values
      );

      const updatedWorkout = response.data?.data?.workout;

      if (!updatedWorkout) {
        throw new Error("Updated workout was not returned");
      }

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6">
      <div className="mx-auto my-5 max-w-5xl rounded-2xl border border-[#363636] bg-[#202020] p-5 sm:p-6">

        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              AURA GO
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Manage · {workout.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-neutral-400 hover:text-white"
          >
            ×
          </button>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Workout exercises */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Workout exercises
            </h3>

            <span className="rounded-full bg-[#303030] px-3 py-1 text-xs text-neutral-300">
              {exercises.length} exercises
            </span>
          </div>

          {exercises.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#404040] p-8 text-center text-neutral-400">
              No exercises yet. Add exercises from the library below.
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((item, index) => {
                const id = String(
                  item.exercise?._id || item.exercise
                );

                return (
                  <div key={id}>
                    <ExerciseRow
                      item={item}
                      index={index}
                      editing={editingId === id}
                      onEdit={() => setEditingId(id)}
                      onCancel={() => setEditingId("")}
                      onSave={(values) => updateExercise(item, values)}
                      onRemove={() => removeExercise(item)}
                      busy={busyId === id}
                    />

                    {onOpenMuscleTutorial &&
                      (item.exercise?.primaryMuscles || []).map(
                        (muscle) => (
                          <button
                            key={muscle}
                            onClick={() => onOpenMuscleTutorial(muscle)}
                            className="mr-2 mt-2 rounded-lg border border-[#404040] bg-[#292929] px-3 py-1.5 text-xs capitalize text-neutral-300 hover:border-neutral-500 hover:text-white"
                          >
                            ◈ {muscle} guide
                          </button>
                        )
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Exercise library */}
        <section className="mt-7 border-t border-[#363636] pt-5">
          <h3 className="font-semibold text-white">
            Exercise library
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            Select an exercise to add it to this workout.
          </p>

          <input
            className={`${inputClass} mt-4`}
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
            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
              {filteredLibrary.map((exercise) => {
                const alreadyAdded = existingIds.has(
                  String(exercise._id)
                );

                return (
                  <div
                    key={exercise._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#363636] bg-[#242424] p-3"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-white">
                        {exercise.name}
                      </p>

                      <p className="mt-1 text-xs capitalize text-neutral-500">
                        {(exercise.primaryMuscles || []).join(", ") ||
                          exercise.category ||
                          "Strength"}
                      </p>
                    </div>

                    <button
                      disabled={
                        alreadyAdded || addingId === exercise._id
                      }
                      onClick={() => addExercise(exercise)}
                      className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black disabled:opacity-40"
                    >
                      {alreadyAdded
                        ? "Added"
                        : addingId === exercise._id
                          ? "Adding..."
                          : "+ Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-6 flex justify-end border-t border-[#363636] pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageExercises;