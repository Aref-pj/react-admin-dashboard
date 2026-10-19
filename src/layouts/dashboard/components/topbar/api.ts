import api from "../../../../app/api/axios"

export interface Notif {
    id: string;
    type: "order" | "user" | "warning" | "payment" | "info";
    title: string;
    message: string;
    time: string;
    read: boolean;
}

export const fetchNotifs = async (): Promise<Notif[]> => {
    const res = await api.get<Notif[]>("/notifications");
    return res.data;
}

export const markAllNotifs = async (ids: string[]): Promise<void> => {
    await Promise.all(
        ids.map((id) => api.patch(`/notifications/${id}`, { read: true })),
    );
};