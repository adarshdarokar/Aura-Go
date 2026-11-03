function WorkoutCard({
  workout,
  onManage,
  onEdit,
  onDelete,
}) {
  const statusStyle = {
    active: "border-green-500/30 bg-green-500/10 text-green-400",
    completed: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    draft: "border-neutral-600 bg-neutral-700/30 text-neutral-400",
  };

  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-[#363636] bg-[#202020] p-5 transition hover:border-[#505050]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3a3a3a] bg-[#292929] text-xl text-white">
          ◈
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
            statusStyle[workout.status] || statusStyle.draft
          }`}
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
          ◈ {workout.exercises?.length || 0} exercises
        </span>
      </div>

      <div className="mt-5 flex-1 border-t border-[#363636] pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Included exercises
        </p>

        {!workout.exercises?.length ? (
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
        <button
          onClick={() => onManage(workout)}
          className="rounded-xl border border-[#404040] bg-[#292929] px-3 py-2.5 text-sm text-white transition hover:bg-[#363636]"
        >
          ☷ Manage
        </button>

        <button
          onClick={() => onEdit(workout)}
          className="rounded-xl border border-[#404040] bg-[#292929] px-3 py-2.5 text-sm text-white transition hover:bg-[#363636]"
        >
          ✎ Edit
        </button>

        <button
          onClick={() => onDelete(workout)}
          className="col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20"
        >
          ⌫ Delete workout
        </button>
      </div>
    </article>
  );
}

export default WorkoutCard;