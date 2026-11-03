function MuscleGroupCard({ group, onSelect }) {
  const imageUrl = group.image?.url || group.imageUrl || "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group overflow-hidden rounded-2xl border border-[#363636] bg-[#202020] text-left transition hover:-translate-y-1 hover:border-[#666]"
    >
      <div className="relative h-48 overflow-hidden bg-[#292929]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={group.image?.alt || group.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-neutral-700">
            ◈
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
          {group.name}
        </h3>
      </div>

      <div className="p-4">
        <p className="min-h-10 text-sm leading-5 text-neutral-400">
          {group.description || "Explore exercises for this muscle group."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {group.exercises?.length || 0} exercises
          </span>

          <span className="text-sm font-semibold text-white transition group-hover:translate-x-1">
            Explore →
          </span>
        </div>
      </div>
    </button>
  );
}

export default MuscleGroupCard;