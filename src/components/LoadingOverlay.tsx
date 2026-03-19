export default function LoadingOverlay() {
  return (
    <div>
      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Analyzing&hellip;
        </span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="space-y-4 animate-pulse">
        {/* Summary skeleton */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="h-11 bg-zinc-100 dark:bg-zinc-800" />
          <div className="bg-white p-5 dark:bg-zinc-900">
            <div className="space-y-2.5">
              <div className="h-3.5 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-3.5 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-3.5 w-3/5 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Issues skeleton */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3.5 w-36 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          {[0, 1].map((i) => (
            <div
              key={i}
              className="mb-2.5 last:mb-0 rounded-lg border-l-[3px] border-l-zinc-200 bg-zinc-50 py-3 pl-4 pr-4 dark:border-l-zinc-700 dark:bg-zinc-800/50"
            >
              <div className="mb-2 h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-700/50" />
              <div className="mt-1.5 h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-700/50" />
            </div>
          ))}
        </div>

        {/* Highlights skeleton */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3.5 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-3 last:mb-0 flex gap-3">
              <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-700/50" />
                <div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-zinc-700/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
