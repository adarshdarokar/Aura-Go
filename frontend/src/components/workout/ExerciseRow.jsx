import { useEffect, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-[#363636] bg-[#171717] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-500";

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

  const change = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

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
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-[#404040] px-3 py-2 text-sm text-neutral-300 hover:bg-[#333]"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {editing && (
        <form
          onSubmit={submit}
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: "Sets", key: "sets", min: "1", step: "1" },
            { label: "Reps", key: "reps", min: "1", step: "1" },
            { label: "Weight (kg)", key: "weight", min: "0", step: "0.5" },
            { label: "Rest (sec)", key: "restTime", min: "0", step: "1" },
          ].map((field) => (
            <label key={field.key} className="block text-sm text-neutral-400">
              {field.label}

              <input
                className={`${inputClass} mt-2`}
                type="number"
                min={field.min}
                step={field.step}
                value={form[field.key]}
                onChange={(e) => change(field.key, e.target.value)}
                required
              />
            </label>
          ))}

          <div className="col-span-2 flex gap-2 sm:col-span-4 sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#404040] px-4 py-2 text-sm text-neutral-300 hover:bg-[#333]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save exercise"}
            </button>
          </div>
        </form>
      )}
    </article>
  );
}

export default ExerciseRow;