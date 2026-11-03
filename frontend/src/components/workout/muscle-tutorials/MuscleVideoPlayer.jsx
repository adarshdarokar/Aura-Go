function MuscleVideoPlayer({ group, onClose }) {
  const videoUrl = group.video?.url;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#363636] bg-[#202020]">
        <div className="flex items-center justify-between border-b border-[#363636] p-4">
          <div>
            <h3 className="font-bold text-white">{group.name}</h3>
            <p className="text-xs text-neutral-500">
              Muscle training tutorial
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-neutral-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="aspect-video bg-black">
          {videoUrl ? (
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              poster={group.video?.thumbnail || undefined}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-neutral-400">
              <span className="mb-3 text-4xl">▶</span>
              <p>Video coming soon</p>
            </div>
          )}
        </div>

        {group.description && (
          <p className="p-4 text-sm text-neutral-400">
            {group.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default MuscleVideoPlayer;