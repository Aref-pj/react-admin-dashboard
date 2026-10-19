import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    columnVisibilityFeature,
    createColumnHelper,
    flexRender,
    rowPaginationFeature,
    tableFeatures,
    useTable,
} from "@tanstack/react-table";
import { LuSearch } from "react-icons/lu";

import type { User } from "../api";
import Pagination from "../../../shared/components/pagination/pagination";
import UserCard from "./userCard";
import StatusBadge from "../../../shared/components/statusBadge/statusBadge";

interface UserTableProps {
    users: User[];
    total: number;
    page: number;
    pageSize: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const SKELETON_ROWS = 5;

const features = tableFeatures({
    rowPaginationFeature,
    columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof features, User>();

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function formatDate(date: string) {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function UserAvatar({ avatar, name }: { avatar?: string; name: string }) {
    const [failed, setFailed] = useState(false);

    if (!avatar || failed) {
        return (
            <div
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full
                    bg-primary/10 text-xs font-semibold text-primary ring-2 ring-c-border
                    sm:size-10 sm:text-sm"
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <div className="size-9 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-c-border sm:size-10">
            <img
                src={avatar}
                alt={name}
                loading="lazy"
                onError={() => setFailed(true)}
                className="size-full object-cover"
            />
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    return (
        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5
            py-1.5 text-xs font-semibold capitalize text-primary">
            {role}
        </span>
    );
}


function EmptyState({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`flex flex-col items-center justify-center text-center ${compact ? "px-4 py-12" : "px-5 py-16"}`}>
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-c-bg">
                <LuSearch size={22} className="text-c-text-muted" />
            </div>
            <p className="font-medium text-c-text-primary">No users found</p>
            <p className="mt-1 text-sm text-c-text-muted">
                Try changing your search query.
            </p>
        </div>
    );
}

export default function UserTable({
    users,
    total,
    page,
    pageSize,
    isLoading,
    onPageChange,
    onPageSizeChange,
}: UserTableProps) {
    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor("name", {
                    header: "User",
                    cell: (info) => {
                        const user = info.row.original;
                        return (
                            <div className="flex min-w-45 items-center gap-3">
                                <UserAvatar avatar={user.avatar} name={user.name} />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-c-text-primary xl:text-base">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-xs text-c-text-muted">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        );
                    },
                }),

                columnHelper.accessor("role", {
                    header: "Role",
                    cell: (info) => (
                        <div className="text-center">
                            <RoleBadge role={info.getValue()} />
                        </div>
                    ),
                }),

                columnHelper.accessor("phone", {
                    header: "Phone",
                    cell: (info) => (
                        <span className="block whitespace-nowrap text-center text-sm text-c-text-primary">
                            {info.getValue() || "-"}
                        </span>
                    ),
                }),

                columnHelper.accessor("state", {
                    header: "Location",
                    cell: (info) => {
                        const user = info.row.original;
                        return (
                            <div className="max-w-45">
                                <p className="truncate text-sm text-c-text-primary">
                                    {user.state || "-"}
                                </p>
                                <p className="truncate text-xs text-c-text-muted">
                                    {user.country}
                                </p>
                            </div>
                        );
                    },
                }),

                columnHelper.accessor("status", {
                    header: "Status",
                    cell: (info) => (
                        <div className="text-center w-full">
                            <StatusBadge status={info.getValue()} />
                        </div>
                    ),
                }),

                columnHelper.accessor("createdAt", {
                    header: "Joined",
                    cell: (info) => (
                        <span className="block whitespace-nowrap text-center text-sm text-c-text-primary">
                            {formatDate(info.getValue())}
                        </span>
                    ),
                }),

                columnHelper.display({
                    id: "actions",
                    header: "",
                    cell: (info) => (
                        <div className="flex justify-center">
                            <Link
                                to={info.row.original.id}
                                className="inline-flex items-center justify-center rounded-lg px-3 py-2 bg-c-primary/10
                                    transition-colors hover:bg-c-primary/20 active:bg-c-primary/25"
                            >
                                <span
                                    className="text-c-primary  font-semibold text-sm"
                                >
                                    View
                                </span>
                            </Link>
                        </div>
                    ),
                }),
            ]),
        [],
    );

    const tableState = useMemo(
        () => ({ pagination: { pageIndex: page - 1, pageSize } }),
        [page, pageSize],
    );

    const table = useTable({
        key: "users-table",
        features,
        columns,
        data: users,
        manualPagination: true,
        rowCount: total,
        state: tableState,
    });

    const columnCount = columns.length;

    const [openPageSize, setOpenPageSize] = useState(false);
    const pageSizeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handlePointerDown(e: PointerEvent) {
            if (pageSizeRef.current && !pageSizeRef.current.contains(e.target as Node)) {
                setOpenPageSize(false);
            }
        }
        if (openPageSize) document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [openPageSize]);

    function handlePageSizeChange(newSize: number) {
        onPageSizeChange(newSize);
    }

    return (
        <>
            <div className="space-y-3 lg:hidden">
                {isLoading ? (
                    Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-2xl border border-c-border p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-10 shrink-0 rounded-full bg-c-bg" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-4 w-2/3 rounded bg-c-bg" />
                                    <div className="h-3 w-full rounded bg-c-bg" />
                                    <div className="h-5 w-20 rounded-full bg-c-bg" />
                                </div>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="h-4 w-1/2 rounded bg-c-bg" />
                                <div className="h-4 w-3/4 rounded bg-c-bg" />
                            </div>
                            <div className="mt-4 h-10 rounded-xl bg-c-bg" />
                        </div>
                    ))
                ) : users.length > 0 ? (
                    users.map((user) => <UserCard key={user.id} user={user} />)
                ) : (
                    <EmptyState compact />
                )}
            </div>

            <div className="hidden w-full lg:block">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-215">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr
                                    key={headerGroup.id}
                                    className="border-b border-c-border bg-c-bg/50"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`whitespace-nowrap px-3 py-3.5 text-xs font-semibold uppercase
                                                tracking-wide text-c-text-muted xl:px-4 2xl:px-5 ${header.column.id === "name"
                                                    ? "text-left"
                                                    : "text-center"
                                                }`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {isLoading ? (
                                Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="border-b border-c-border">
                                        {Array.from({ length: columnCount }).map((_, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="px-3 py-4 xl:px-4 2xl:px-5"
                                            >
                                                {colIndex === 0 ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 shrink-0 animate-pulse rounded-full bg-c-bg" />
                                                        <div className="min-w-0 space-y-2">
                                                            <div className="h-4 w-28 animate-pulse rounded bg-c-bg" />
                                                            <div className="h-3 w-36 animate-pulse rounded bg-c-bg" />
                                                        </div>
                                                    </div>
                                                ) : colIndex === columnCount - 1 ? (
                                                    <div className="mx-auto h-9 w-16 animate-pulse rounded-lg bg-c-bg" />
                                                ) : colIndex === 1 || colIndex === 4 ? (
                                                    <div className="mx-auto h-7 w-16 animate-pulse rounded-full bg-c-bg" />
                                                ) : (
                                                    <div className="mx-auto h-4 w-20 animate-pulse rounded bg-c-bg" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-c-border transition-colors last:border-b-0 hover:bg-c-bg/50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-3 py-4 xl:px-4 2xl:px-5"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columnCount}>
                                        <EmptyState />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 w-full lg:mt-6">
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={onPageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </>
    );
}