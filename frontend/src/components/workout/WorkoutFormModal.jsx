import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  description: "",
  difficulty: "intermediate",
  estimatedDuration: 60,
  status: "draft",
};

function WorkoutFormModal({
  workout,
  onClose,
  onSave,
  busy,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (workout) {
      setForm({
        name: workout.name || "",
        description: workout.description || "",
        difficulty: workout.difficulty || "intermediate",
        estimatedDuration: workout.estimatedDuration || 60,
        status: workout.status || "draft",
      });
    } else {
      setForm(initialForm);
    }
  }, [workout]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "estimatedDuration"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#363636] bg-[#202020] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {workout ? "Edit workout" : "Create workout"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-neutral-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Workout name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Push Day"
              className="w-full rounded-xl border border-[#363636] bg-[#171717] px-4 py-3 text-white outline-none focus:border-neutral-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Workout description..."
              className="w-full resize-none rounded-xl border border-[#363636] bg-[#171717] px-4 py-3 text-white outline-none focus:border-neutral-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Difficulty
            </label>

            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#363636] bg-[#171717] px-4 py-3 text-white outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Estimated duration (minutes)
            </label>

            <input
              type="number"
              name="estimatedDuration"
              min="1"
              value={form.estimatedDuration}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#363636] bg-[#171717] px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-300">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#363636] bg-[#171717] px-4 py-3 text-white outline-none"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#404040] px-4 py-2.5 text-sm text-neutral-300 hover:bg-[#303030]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {busy
                ? "Saving..."
                : workout
                  ? "Save changes"
                  : "Create workout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkoutFormModal;