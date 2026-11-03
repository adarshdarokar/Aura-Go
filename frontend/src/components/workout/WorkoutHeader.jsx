function WorkoutHeader({ onCreate }) {
  return (
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

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200 sm:self-auto"
      >
        <span className="inline-flex w-5 justify-center">＋</span>
        Create workout
      </button>
    </header>
  );
}

export default WorkoutHeader;