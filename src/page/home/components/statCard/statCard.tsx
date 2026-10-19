import type { ReactNode } from "react";

interface StatCardProps {
  title?: string;
  icon?: ReactNode;
  perc?: number;
  num?: number;
}

export default function StatCard({
  title,
  icon,
  perc,
  num,
}: StatCardProps) {
  const isPositive = perc !== undefined && perc >= 0;

  return (
    <div className="flex items-center justify-between rounded-2xl [corner-shape:squircle] bg-c-surface relative
      border border-c-border p-4 sm:p-5">
      <div className="flex flex-col gap-2">
        <span className="text-xl font-medium mb-4 text-c-text-secondary">
          {title}
        </span>

        <div className="flex items-center gap-3 mb-4 pl-1.5">
          <span className="text-3xl font-extrabold text-c-text font-manrope tracking-tight">
            {num?.toLocaleString() ?? "0"}
          </span>

          {perc !== undefined && (
            <span
              className={`inline-flex items-center translate-y-0.75 text-sm font-semibold px-2 py-0.5 text-nowrap 
                  rounded-full ${isPositive
                  ? "text-c-success bg-c-success/10"
                  : "text-c-danger bg-c-danger/10"
                }`}
            >
              {isPositive ? "+ " : "- "}
              {Math.abs(perc)} %
            </span>
          )}
        </div>
        <p className="text-sm text-c-text-secondary text-nowrap pl-1.5">
          Compared to Last Month
        </p>
      </div>

      {icon && (
        <div className="h-full absolute top-4 right-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-c-primary/10 text-c-primary">
            {icon}
          </div>
        </div>
      )}
    </div>
  );
}