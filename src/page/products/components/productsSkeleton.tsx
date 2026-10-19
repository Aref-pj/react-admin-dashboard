const ROWS = 5;

function DesktopSkeleton() {
  return (
    <div className="hidden md:block">
      <div className="flex border-b border-c-border bg-c-bg/50 px-5 py-3.5">
        {["Product", "Category", "Price", "Stock", "Sold", "Status"].map(
          (label) => (
            <span
              key={label}
              className="flex-1 text-xs font-semibold uppercase tracking-wide text-c-text-muted"
            >
              {label}
            </span>
          ),
        )}
      </div>

      {Array.from({ length: ROWS }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-5 border-b border-c-border px-5 py-4
            last:border-b-0"
        >
          <div className="size-11 shrink-0 animate-pulse rounded-lg bg-c-bg" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-c-bg" />
            <div className="h-3 w-1/5 animate-pulse rounded bg-c-bg" />
          </div>

          <div className="h-4 w-16 shrink-0 animate-pulse rounded bg-c-bg" />
          <div className="h-4 w-14 shrink-0 animate-pulse rounded bg-c-bg" />
          <div className="h-6 w-20 shrink-0 animate-pulse rounded-full bg-c-bg" />
        </div>
      ))}
    </div>
  );
}

function MobileSkeleton() {
  return (
    <div className="md:hidden">
      {Array.from({ length: ROWS }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-3 border-b border-c-border p-4
            last:border-b-0"
        >
          <div className="size-16 shrink-0 animate-pulse rounded-xl bg-c-bg" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-c-bg" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-c-bg" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-c-bg" />
          </div>

          <div className="h-5 w-16 shrink-0 animate-pulse rounded bg-c-bg" />
        </div>
      ))}
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between border-t border-c-border px-4 py-3">
      <div className="h-5 w-32 animate-pulse rounded bg-c-bg" />

      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="size-9 animate-pulse rounded-lg bg-c-bg"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductsSkeleton() {
  return (
    <div
      className="rounded-2xl border border-c-border bg-c-surface"
      aria-busy="true"
      aria-live="polite"
    >
      <DesktopSkeleton />

      <MobileSkeleton />

      <PaginationSkeleton />
    </div>
  );
}
