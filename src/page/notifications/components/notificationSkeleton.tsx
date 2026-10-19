const SKELETON_ROWS = 5;

export default function NotificationSkeleton() {
    return (
        <div>
            {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-start gap-4 border-b border-c-border px-5 py-4 
                        last:border-b-0"
                >
                    <div className="size-10 shrink-0 animate-pulse rounded-xl bg-c-bg" />

                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-2/5 animate-pulse rounded bg-c-bg" />
                        <div className="h-3.5 w-4/5 animate-pulse rounded bg-c-bg" />
                    </div>

                    <div className="h-3.5 w-16 shrink-0 animate-pulse rounded bg-c-bg" />
                </div>
            ))}
        </div>
    );
}
