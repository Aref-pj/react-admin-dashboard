import { Link } from "react-router-dom";
import { LuCalendarDays, LuMapPin, LuPhone} from "react-icons/lu";
import { useState } from "react";
import type { User } from "../api";
import StatusBadge from "../../../shared/components/statusBadge/statusBadge";


interface UserCardProps {
  user: User;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
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

function UserAvatar({
  avatar,
  name,
}: {
  avatar?: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!avatar || failed) {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-c-primary/10 text-sm 
        font-semibold text-c-primary ring-1 ring-c-border">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="size-12 shrink-0 overflow-hidden rounded-full bg-c-bg ring-1 ring-c-border">
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

export default function UserCard({ user }: UserCardProps) {

  return (
    <article className="rounded-2xl border border-c-border bg-c-surface p-4 transition-colors hover:bg-c-bg/40">
      <div className="flex items-start gap-3">
        <UserAvatar avatar={user.avatar} name={user.name} />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-c-text-primary">
            {user.name}
          </h3>

          <p className="mt-1 truncate text-xs text-c-text-muted">
            {user.email || "-"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-c-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-c-primary">
              {user.role}
            </span>

            <StatusBadge
              status={user.status}
            />
 
          </div>
        </div>
      </div>

      <div className="my-4 border-t border-c-border" />

      <div className="grid grid-cols-1 gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <LuPhone size={16} className="shrink-0 text-c-text-muted" />

          <span className="truncate text-sm text-c-text-secondary">
            {user.phone || "-"}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2.5">
          <LuMapPin size={16} className="shrink-0 text-c-text-muted" />

          <span className="truncate text-sm text-c-text-secondary">
            {[user.state, user.country].filter(Boolean).join(", ") || "-"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <LuCalendarDays size={16} className="shrink-0 text-c-text-muted" />

          <span className="text-sm text-c-text-secondary">
            Joined {formatDate(user.createdAt)}
          </span>
        </div>
      </div>

      <Link
        to={user.id}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-c-primary/10 px-4 py-2.5 text-sm
             font-semibold text-c-primary transition-colors hover:bg-c-primary/20"
      >
        View Details
      </Link>
    </article>
  );
}