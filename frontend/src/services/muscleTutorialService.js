export const getAllMuscleTutorials = async (request) => {
  const response = await request.get("/muscle-tutorials");

  return response.data?.data?.tutorials || [];
};

export const getMuscleTutorialByName = async (request, muscle) => {
  if (!muscle) {
    throw new Error("Muscle name is required.");
  }

  const response = await request.get(
    `/muscle-tutorials/${encodeURIComponent(
      muscle.trim().toLowerCase()
    )}`
  );

  return response.data?.data?.tutorial || null;
};