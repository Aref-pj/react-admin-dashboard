import {
    IoBagHandleOutline,
    IoPersonAddOutline,
    IoWarningOutline,
    IoCardOutline,
    IoInformationCircleOutline,
    IoCheckmarkDoneOutline,
} from "react-icons/io5";
import { LuTrash2, LuChevronDown } from "react-icons/lu";

import type { ComponentType } from "react";
import type { Notification, NotificationType } from "../api";

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
    expanded?: boolean;
    onToggleExpand: () => void;
    isReading?: boolean;
    isDeleting?: boolean;
}

interface NotificationActionsProps {
    read: boolean;
    busy: boolean;
    focusable: boolean;
    className?: string;
    onRead: () => void;
    onDelete: () => void;
}

const typeStyles: Record<NotificationType, string> = {
    order: "bg-c-primary/10 text-c-primary",
    user: "bg-c-secondary/10 text-c-secondary",
    warning: "bg-c-warning/10 text-c-warning",
    payment: "bg-c-success/10 text-c-success",
    info: "bg-c-info/10 text-c-info",
};

const typeIcons: Record<NotificationType, ComponentType<{ size?: number }>> = {
    order: IoBagHandleOutline,
    user: IoPersonAddOutline,
    warning: IoWarningOutline,
    payment: IoCardOutline,
    info: IoInformationCircleOutline,
};

function NotificationActions({
    read,
    busy,
    focusable,
    className = "",
    onRead,
    onDelete,
}: NotificationActionsProps) {
    return (
        <div className={`flex shrink-0 items-center gap-1 ${className}`}>
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onRead();
                }}
                disabled={busy || read}
                aria-label="Mark as read"
                title="Mark as read"
                tabIndex={focusable ? 0 : -1}
                className={`flex size-9 items-center justify-center rounded-lg
                    text-c-text-muted transition-colors
                    disabled:cursor-default disabled:opacity-50
                    ${!read && "hover:bg-c-primary/10 hover:text-c-primary"}`}
            >
                <IoCheckmarkDoneOutline
                    size={17}
                    color={read ? "var(--ui-primary)" : undefined}
                />
            </button>
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                }}
                disabled={busy}
                aria-label="Delete notification"
                title="Delete"
                tabIndex={focusable ? 0 : -1}
                className="flex size-9 items-center justify-center rounded-lg
                    text-c-text-muted transition-colors hover:bg-c-danger/10
                    hover:text-c-danger disabled:cursor-not-allowed disabled:opacity-50"
            >
                <LuTrash2 size={16} />
            </button>
        </div>
    );
}

export default function NotificationItem({
    notification,
    onRead,
    onDelete,
    expanded = false,
    onToggleExpand,
    isReading = false,
    isDeleting = false,
}: NotificationItemProps) {
    const { id, type, title, message, time, read } = notification;

    const Icon = typeIcons[type];
    const isBusy = isReading || isDeleting;
    const bodyId = `notification-body-${id}`;

    return (
        <div className="relative border-b border-c-border last:border-b-0">
            {!read && (
                <span
                    aria-hidden="true"
                    className="absolute left-1.5 top-7 size-1.5 rounded-full bg-c-primary"
                />
            )}

            {/* Desktop layout */}
            <div
                className={`group hidden items-center justify-between gap-4 px-5 py-4 transition-colors md:flex ${read
                    ? "hover:bg-c-surface-hover"
                    : "bg-c-primary/10 hover:bg-c-primary/20"
                    }`}
            >
                <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${typeStyles[type]}`}
                >
                    <Icon size={19} />
                </span>

                {read ? (
                    <div className="min-w-0 flex-1 text-left">
                        <h4 className="truncate text-sm font-medium text-c-text">
                            {title}
                        </h4>

                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-c-text-muted">
                            {message}
                        </p>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => onRead(id)}
                        disabled={isBusy}
                        aria-label={`Mark "${title}" as read`}
                        title="Mark as read"
                        className="min-w-0 flex-1 text-left disabled:cursor-wait"
                    >
                        <h4 className="truncate text-sm font-semibold text-c-text">
                            {title}
                        </h4>

                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-c-text-muted">
                            {message}
                        </p>
                    </button>
                )}

                <div className="flex w-28 shrink-0 justify-center">
                    <span className="whitespace-nowrap text-center text-xs text-c-text-muted">
                        {time}
                    </span>
                </div>

                <NotificationActions
                    read={read}
                    busy={isBusy}
                    focusable
                    className="opacity-0 transition-opacity duration-150 focus-within:opacity-100 group-hover:opacity-100"
                    onRead={() => onRead(id)}
                    onDelete={() => onDelete(id)}
                />
            </div>

            {/* Mobile layout */}
            <div className="group">
                <button
                    type="button"
                    onClick={onToggleExpand}
                    aria-expanded={expanded}
                    aria-controls={bodyId}
                    className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors md:hidden
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
                        focus-visible:ring-c-primary/40
                        ${read
                            ? "group-hover:bg-c-surface-hover"
                            : "bg-c-primary/10 group-hover:bg-c-primary/20"
                        }`}
                >
                    <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${typeStyles[type]}`}
                    >
                        <Icon size={19} />
                    </span>

                    <span className="sr-only">Notification: {title}</span>

                    {expanded ? (
                        <span className="ml-auto whitespace-nowrap text-xs text-c-text-muted">
                            {time}
                        </span>
                    ) : (
                        <p className="mr-auto overflow-hidden text-ellipsis whitespace-nowrap text-xs text-c-text-muted">
                            {message}
                        </p>
                    )}

                    <LuChevronDown
                        size={18}
                        aria-hidden="true"
                        className={`shrink-0 text-c-text-muted transition-transform duration-200 motion-reduce:transition-none
                ${expanded ? "rotate-180" : "rotate-0"}`}
                    />
                </button>

                <div
                    id={bodyId}
                    role="region"
                    aria-label="Notification details"
                    aria-hidden={!expanded}
                    className={`grid transition-all duration-200 ease-in-out motion-reduce:transition-none md:hidden
                            ${expanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                            ${read
                            ? "group-hover:bg-c-surface-hover"
                            : "bg-c-primary/10 group-hover:bg-c-primary/20"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="flex flex-col gap-2 px-5 pb-4">
                            <h4 className="text-sm font-semibold text-c-text">
                                {title}
                            </h4>

                            <p className="text-sm leading-6 text-c-text-muted">
                                {message}
                            </p>

                            <div className="mt-1 flex items-center gap-1 border-t border-c-border pt-3">
                                <NotificationActions
                                    read={read}
                                    busy={isBusy}
                                    focusable={expanded}
                                    onRead={() => onRead(id)}
                                    onDelete={() => onDelete(id)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
