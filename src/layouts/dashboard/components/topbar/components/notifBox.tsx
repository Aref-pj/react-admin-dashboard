import {
    IoCheckmarkDoneOutline,
    IoBagHandleOutline,
    IoPersonAddOutline,
    IoWarningOutline,
    IoCardOutline,
    IoInformationCircleOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

import type { Notif } from "../api";

interface NotifBoxProps {
    notifications: Notif[];
    isLoading: boolean;
    readAllNotifs: (ids: string[]) => void;
}

const notificationIcons = {
    order: IoBagHandleOutline,
    user: IoPersonAddOutline,
    warning: IoWarningOutline,
    payment: IoCardOutline,
    info: IoInformationCircleOutline,
};

export default function NotifBox({
    notifications,
    isLoading,
    readAllNotifs,
}: NotifBoxProps) {

    const unreadIds = notifications
        .filter((notification) => !notification.read)
        .map((notification) => notification.id);

    const unreadCount = unreadIds.length;

    return (
        <div
            className="w-90 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl
            border border-c-border bg-c-surface shadow-xl"
        >

            <div className="flex items-center justify-between border-b border-c-border px-4 py-3">

                <div>
                    <h3 className="text-sm font-semibold text-c-text">
                        Notifications
                    </h3>

                    <p className="mt-0.5 text-xs text-c-text-muted">
                        {unreadCount} unread notification
                        {unreadCount !== 1 ? "s" : ""}
                    </p>
                </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={() => readAllNotifs(unreadIds)}
                            className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs
                            font-medium text-c-primary transition-opacity hover:opacity-70"
                        >
                            {!isLoading && <IoCheckmarkDoneOutline size={15} />}
                            {!isLoading ? "Mark all as read" : "marking..."}
                        </button>
                    )}
            </div>

            <div className="max-h-90 overflow-y-auto">

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-10">

                        <IoInformationCircleOutline
                            size={32}
                            className="mb-2 text-c-text-muted"
                        />

                        <p className="text-sm font-medium text-c-text">
                            No notifications
                        </p>

                        <p className="mt-1 text-xs text-c-text-muted">
                            You're all caught up.
                        </p>
                    </div>
                ) : (
                    notifications.slice(0, 5).map((notification) => {

                        const Icon = notificationIcons[notification.type];

                        return (
                            <div
                                key={notification.id}
                                className={`group relative flex gap-3 border-b border-c-border
                                px-4 py-3 transition-colors cursor-pointer
                                ${
                                    !notification.read
                                        ? "bg-c-primary/10 hover:bg-c-primary/20"
                                        : "hover:bg-c-surface-hover"
                                }`}
                            >

                                {!notification.read && (
                                    <span
                                        className="absolute left-1.5 top-5 h-1.5 w-1.5
                                        rounded-full bg-c-primary"
                                    />
                                )}

                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                                    ${
                                        notification.type === "warning"
                                            ? "bg-warning/10 text-warning"
                                            : notification.type === "payment"
                                            ? "bg-success/10 text-success"
                                            : notification.type === "user"
                                            ? "bg-secondary/10 text-secondary"
                                            : "bg-c-primary/10 text-c-primary"
                                    }`}
                                >
                                    <Icon size={18} />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <div className="flex items-start justify-between gap-2">

                                        <h4
                                            className={`truncate text-sm ${
                                                notification.read
                                                    ? "font-medium"
                                                    : "font-semibold"
                                            } text-c-text`}
                                        >
                                            {notification.title}
                                        </h4>

                                        <span className="shrink-0 text-[10px] text-c-text-muted">
                                            {notification.time}
                                        </span>
                                    </div>

                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-c-text-muted">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {notifications.length > 5 && (
                <Link
                    to="/notifications"
                    className="block w-full py-3 text-center text-xs font-semibold text-c-primary
                        transition-colors hover:bg-c-primary/10 active:bg-c-primary/20"
                >
                    View all notifications
                </Link>
            )}
        </div>
    );
}
