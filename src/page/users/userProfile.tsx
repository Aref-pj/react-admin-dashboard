import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";

import IconButton from "../../shared/components/iconButton/iconButton";
import { getUserById } from "./api";
import StatusBadge from "../../shared/components/statusBadge/statusBadge";

import {
    LuArrowLeft,
    LuMail,
    LuPhone,
    LuPrinter,
} from "react-icons/lu";
import UserNotFound from "./components/userNotFound";
import ProfileSkeleton from "./components/profileSkeleton";

interface InfoItemProps {
    label: string;
    value?: string;
    valueClassName?: string;
}

function InfoItem({ label, value, valueClassName = "" }: InfoItemProps) {
    return (
        <div className="min-w-0">
            <p className="text-xs max-sm:text-base mb-2 font-bold text-c-text-muted">
                {label}
            </p>
            <p className={`text-sm max-sm:text-lg wrap-break-word ${valueClassName}`}>
                {value || "-"}
            </p>
        </div>
    );
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    return parts
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
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
                className="flex size-19 max-sm:size-22 shrink-0 items-center justify-center rounded-full
                     bg-primary/10 text-xl font-semibold text-primary ring-2 ring-c-border"
            >
                {getInitials(name)}
            </div>
        );
    }

    return (
        <div className="size-19 max-sm:size-22 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-c-border">
            <img
                src={avatar}
                alt={name}
                onError={() => setFailed(true)}
                className="size-full object-cover"
            />
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    return (
        <span className="flex items-center justify-center rounded-full bg-primary/10 px-2.5
            py-1.5 text-xs font-semibold capitalize text-primary"
        >
            {role}
        </span>
    );
}


export default function UserProfile() {
    const { userid } = useParams<{ userid: string }>();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["user", userid],
        queryFn: () => getUserById(userid as string),
        enabled: Boolean(userid),
        retry: false,
    });

    const printRef = useRef<HTMLDivElement>(null);
    const printHandler = useReactToPrint({
        contentRef: printRef,
    });

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (isError || !user) {
        return <UserNotFound />;
    }

    return (
        <div
            ref={printRef}
            className="print-box bg-c-surface max-sm:bg-c-background w-full 
                border border-c-border rounded-2xl max-sm:rounded-none max-sm:border-none
                flex flex-col gap-4 p-3 max-sm:p-2"
        >
            <div className="mb-1 flex items-center justify-between gap-4 max-sm:px-1">
                <div className="flex min-w-0 items-center gap-3 px-2 pt-2">
                    <Link
                        to="/users"
                        className="no-print inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5
                            rounded-4xl border border-c-border bg-c-surface px-3 py-2
                            text-c-text-secondary transition hover:bg-c-surface-hover
                            hover:text-c-text active:bg-c-surface-active"
                    >
                        <LuArrowLeft size={16} />
                        <span>Back</span>
                    </Link>

                    <h2 className="truncate text-2xl font-semibold text-c-text-secondary">
                        User Profile
                    </h2>
                </div>

                <IconButton
                    onclick={printHandler}
                    className="no-print size-10 bg-c-surface"
                >
                    <LuPrinter size={18} />
                </IconButton>
            </div>

            <div
                className="flex w-full items-center justify-between gap-6
                    rounded-2xl border border-c-border bg-c-surface px-5 py-4
                    max-sm:flex-col max-sm:px-6 max-sm:py-5"
            >
                <div className="flex min-w-0 items-center gap-5 max-sm:flex-col">
                    <UserAvatar
                        avatar={user.avatar}
                        name={user.name}
                    />

                    <div className="min-w-0 max-sm:text-center">
                        <p className="truncate text-xl font-bold max-sm:text-2xl">
                            {user.name}
                        </p>

                        <div className="mt-2 flex items-center gap-2 max-sm:justify-center">
                            <RoleBadge role={user.role} />
                            <StatusBadge status={user.status} />
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 max-sm:w-full max-sm:justify-center">
                    <a
                        href={`mailto:${user.email}`}
                        tabIndex={-1}
                        className="rounded-full"
                    >
                        <IconButton className="size-12">
                            <LuMail size={22} />
                        </IconButton>
                    </a>

                    <a
                        href={`tel:${user.phone.replace(/\s+/g, "")}`}
                        tabIndex={-1}
                        className="rounded-full"
                    >
                        <IconButton className="size-12">
                            <LuPhone size={22} />
                        </IconButton>
                    </a>
                </div>
            </div>

            <div className="w-full rounded-2xl border border-c-border bg-c-surface px-6 py-5 max-sm:px-4">
                <h3 className="mb-6 text-lg font-semibold text-c-text-secondary">
                    Personal Information
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-6 px-3 max-sm:grid-cols-1">
                    <InfoItem label="Full Name" value={user.name} />
                    <InfoItem
                        label="Role"
                        value={user.role}
                        valueClassName="capitalize"
                    />
                    <InfoItem label="Phone" value={user.phone} />
                    <InfoItem label="Email" value={user.email} />
                    <InfoItem label="National ID" value={user.nationalId} />
                    <InfoItem label="Joined" value={formatDate(user.createdAt)} />
                </div>
            </div>

            <div className="w-full rounded-2xl border border-c-border bg-c-surface px-6 py-5 max-sm:px-4">
                <h3 className="mb-6 text-lg font-semibold text-c-text-secondary">
                    Address
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-6 px-3 max-sm:grid-cols-1">
                    <InfoItem label="Country" value={user.country} />
                    <InfoItem label="State / City" value={user.state} />
                    <InfoItem
                        label="Residential Address"
                        value={user.residentialAddress}
                    />
                    <InfoItem label="Postal Code" value={user.postal} />
                </div>
            </div>
        </div>
    );
}