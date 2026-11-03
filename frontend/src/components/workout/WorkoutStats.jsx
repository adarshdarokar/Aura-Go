function WorkoutStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label || index}
          className="rounded-2xl border border-[#363636] bg-[#202020] p-4"
        >
          <p className="text-sm text-neutral-400">{stat.label}</p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {stat.value ?? 0}
          </h3>

          {stat.description && (
            <p className="mt-1 text-xs text-neutral-500">
              {stat.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default WorkoutStats;