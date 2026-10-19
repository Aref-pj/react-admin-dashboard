interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  showDot?: boolean;
  pulse?: boolean;
}

const STATUS_STYLES: Record<
  string,
  { container: string; dot?: string }
> = {
  active: {
    container: "bg-c-success/10 text-c-success",
  },
  inactive: {
    container: "bg-c-danger/10 text-c-danger",
  },
  draft: {
    container: "bg-c-warning/10 text-c-warning",
  },
  archived: {
    container:
      "bg-c-bg text-c-text-muted ring-1 ring-inset ring-c-border",
  },
  pending: {
    container: "bg-c-warning/10 text-c-warning",
    dot: "bg-c-warning",
  },
  processing: {
    container: "bg-c-primary/10 text-c-primary",
  },
  shipped: {
    container: "bg-c-secondary/10 text-c-secondary",
  },
  delivered: {
    container: "bg-c-success/10 text-c-success",
  },
  cancelled: {
    container: "bg-c-danger/10 text-c-danger",
  },
  approved: {
    container: "bg-c-success/10 text-c-success",
  },
  declined: {
    container: "bg-c-danger/10 text-c-danger",
  },
  refunded: {
    container: "bg-c-secondary/10 text-c-secondary",
  },
};

export default function StatusBadge({
  status,
  label,
  className = "",
  showDot = true,
  pulse = false,
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const style = STATUS_STYLES[normalizedStatus] ?? {
    container: "bg-c-bg text-c-text-muted ring-1 ring-inset ring-c-border",
  };

  const displayLabel =
    label ?? status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5
        whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold
        ${style.container} ${className}`}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className="relative flex size-1.5 shrink-0 items-center justify-center"
        >
          {pulse && (
            <span
              className={`absolute size-2 animate-ping rounded-full opacity-75
                ${style.dot ?? "bg-current"}`}
            />
          )}

          <span
            className={`relative size-1.5 rounded-full bg-current
              ${normalizedStatus === "archived" ? "opacity-50" : ""}`}
          />
        </span>
      )}

      {displayLabel}
    </span>
  );
}