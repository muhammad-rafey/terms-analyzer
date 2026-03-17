export default function LoadingOverlay() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-indigo-300 dark:bg-indigo-700" />
          <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-6 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-2">
        Analyzing with Qwen3.5-Flash...
      </p>

      {/* Shimmer cards */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-700" />
            <div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-700" />
            <div className="h-3 w-3/5 rounded bg-zinc-100 dark:bg-zinc-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
