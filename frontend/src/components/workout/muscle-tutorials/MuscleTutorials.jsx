import { useEffect, useState } from "react";
import { getMuscleTutorialByName } from "../../../services/muscleTutorialService";
import MuscleGroupCard from "./MuscleGroupCard";
import MuscleVideoPlayer from "./MuscleVideoPlayer";

function MuscleTutorials({ muscle, request, onClose }) {
  const [tutorial, setTutorial] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTutorial = async () => {
      setLoading(true);
      setError("");
      setTutorial(null);
      setSelectedGroup(null);

      try {
        const data = await getMuscleTutorialByName(request, muscle);

        if (!cancelled) {
          setTutorial(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Unable to load muscle tutorials."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (muscle) loadTutorial();

    return () => {
      cancelled = true;
    };
  }, [muscle, request]);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/90 p-4 backdrop-blur-sm sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
              AURA GO · MUSCLE GUIDE
            </p>

            <h2 className="mt-2 text-3xl font-black capitalize text-white">
              {muscle} Tutorials
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Explore muscle groups and learn the exercises.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#363636] bg-[#202020] px-4 py-2 text-xl text-neutral-300 hover:bg-[#303030]"
          >
            ×
          </button>
        </header>

        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            Loading muscle tutorials...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
            {error}
          </div>
        ) : !tutorial?.groups?.length ? (
          <div className="rounded-xl border border-[#363636] bg-[#202020] p-8 text-center text-neutral-400">
            No muscle groups available yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tutorial.groups.map((group) => (
                <MuscleGroupCard
                  key={group._id || group.name}
                  group={group}
                  onSelect={() => setSelectedGroup(group)}
                />
              ))}
            </div>

            {selectedGroup && (
              <MuscleVideoPlayer
                group={selectedGroup}
                onClose={() => setSelectedGroup(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MuscleTutorials;