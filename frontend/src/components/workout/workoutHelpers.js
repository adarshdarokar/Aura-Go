export const inputClass =
  "w-full rounded-xl border border-[#363636] bg-[#171717] px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-500";

export const getError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

export const normalizeWorkout = (workout) => ({
  ...workout,
  exercises: Array.isArray(workout?.exercises)
    ? workout.exercises
    : [],
});