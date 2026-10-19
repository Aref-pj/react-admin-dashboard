import api from "../../app/api/axios";

export type NotificationType =
    | "order"
    | "user"
    | "warning"
    | "payment"
    | "info";

export type NotificationFilter = "all" | "unread" | NotificationType;

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

interface JsonServerResponse {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: Notification[];
}

export interface GetNotificationsResponse {
    notifications: Notification[];
    total: number;
    pages: number;
}

interface GetNotificationsParams {
    page: number;
    limit: number;
    filter?: NotificationFilter;
    search?: string;
}

export async function getNotifications({
    page,
    limit,
    filter = "all",
    search = "",
}: GetNotificationsParams): Promise<GetNotificationsResponse> {
    const params: Record<string, string | number> = {
        _page: page,
        _per_page: limit,
    };

    if (filter === "unread") {
        params.read = "false";
    } else if (filter !== "all") {
        params.type = filter;
    }

    if (search.trim()) {
        params["message:contains"] = search.trim();
    }

    const response = await api.get<JsonServerResponse>("/notifications", {
        params,
    });

    return {
        notifications: response.data.data,
        total: response.data.items,
        pages: response.data.pages,
    };
}

export async function getAllUnreadNotifications(): Promise<Notification[]> {
    const limit = 100;

    const firstPage = await getNotifications({
        page: 1,
        limit,
        filter: "unread",
    });

    if (firstPage.pages <= 1) {
        return firstPage.notifications;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: firstPage.pages - 1 }, (_, index) =>
            getNotifications({
                page: index + 2,
                limit,
                filter: "unread",
            }),
        ),
    );

    return [
        ...firstPage.notifications,
        ...remainingPages.flatMap((result) => result.notifications),
    ];
}

export async function markNotificationRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}`, { read: true });
}

export async function deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
}