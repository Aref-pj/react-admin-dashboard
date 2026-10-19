function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`skeleton bg-c-text-muted/30 [--color-base-100:var(--ui-text-disabled)]  ${className}`} />
    );
}

function SkeletonInfoItem() {
    return (
        <div className="flex flex-col gap-2.5">
            <Skeleton className="h-3.5 w-20 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
        </div>
    );
}

function SkeletonCard({
    titleWidth,
    fields,
}: {
    titleWidth: string;
    fields: number;
}) {
    return (
        <div className="w-full rounded-2xl border border-c-border bg-c-surface px-6 py-5 max-sm:px-4">
            <Skeleton className={`mb-6 h-6 ${titleWidth} rounded`} />

            <div className="grid grid-cols-2 gap-x-6 gap-y-6 px-3 max-sm:grid-cols-1">
                {Array.from({ length: fields }).map((_, index) => (
                    <SkeletonInfoItem key={index} />
                ))}
            </div>
        </div>
    );
}

export default function ProfileSkeleton() {
    return (
        <section className="space-y-5">

            <div
                className="flex w-full items-center justify-between gap-6 rounded-2xl border
                    border-c-border bg-c-surface px-5 py-4 max-sm:flex-col max-sm:px-6 max-sm:py-5"
            >
                <div className="flex min-w-0 items-center gap-5 max-sm:flex-col">
                    <Skeleton className="size-19 shrink-0 rounded-full" />

                    <div className="min-w-0 max-sm:flex max-sm:flex-col max-sm:items-center">
                        <Skeleton className="h-6 w-48 rounded-md" />

                        <div className="mt-2 flex items-center gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            <SkeletonCard titleWidth="w-40" fields={6} />
            <SkeletonCard titleWidth="w-24" fields={4} />
        </section>
    );
}