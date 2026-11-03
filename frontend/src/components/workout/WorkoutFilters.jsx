function WorkoutFilters({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  const filters = ["All", "Active", "Completed"];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search workouts..."
        className="w-full rounded-xl border border-[#363636] bg-[#202020] px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-500 sm:max-w-xs"
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === item
                ? "bg-white text-black"
                : "border border-[#363636] bg-[#202020] text-neutral-400 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default WorkoutFilters;