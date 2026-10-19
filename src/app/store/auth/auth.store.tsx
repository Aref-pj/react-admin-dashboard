import { create } from "zustand";

import { isAxiosError } from "axios";

import api from "../../api/axios";

export interface UserType {
    name: string;
    avatar: string;
    role: string;
    phone: string;
    email: string;
    nationalId: string;
    country: string;
    state: string;
    residentialAddress: string;
    postal: string;
}

export interface Auth {
    user: UserType | null;
    isInitialized: boolean;
    pending: {
        login: boolean;
        logout: boolean;
        getMe: boolean;
        setUser: boolean;
    };

    login(username: string, password: string): Promise<number | null>;
    logout(): Promise<number | null>;
    getMe(): Promise<void>;
    setUser(user: UserType): Promise<UserType | null>;
}

const authChannel = new BroadcastChannel("auth");

let meAbortController: AbortController | null = null;

const useAuthStore = create<Auth>((set, get) => ({
    user: null,
    isInitialized: false,
    pending: {
        login: false,
        logout: false,
        getMe: false,
        setUser: false,
    },

    login: async (username, password) => {
        if (get().pending.login) return null;

        set((s) => ({ pending: { ...s.pending, login: true } }));
        try {
            const res = await api.post("/login", { username, password });
            set({
                user: res.data,
                isInitialized: true,
            });

            authChannel.postMessage({ type: "USER_UPDATED", user: res.data });
            return res.status;
        } catch (err) {
            // json-server has no /login route, so the mock backend answers 404.
            // Fall back to the /getme record to open the mock session.
            if (isAxiosError(err) && err.response?.status === 404) {
                await get().getMe();
                return 200;
            }
            throw err;
        } finally {
            set((s) => ({ pending: { ...s.pending, login: false } }));
        }
    },

    logout: async () => {
        meAbortController?.abort();
        meAbortController = null;

        set((s) => ({ pending: { ...s.pending, logout: true } }));
        try {
            // const res = await api.post("/logout"); Mock
            set((s) => ({
                user: null,
                pending: { ...s.pending, logout: false },
            }));

            authChannel.postMessage({ type: "LOGOUT" });
            return 200; //res.status
        } catch (err) {
            set((s) => ({ pending: { ...s.pending, logout: false } }));
            throw err;
        }
    },

    getMe: async () => {
        meAbortController?.abort();
        const controller = new AbortController();
        meAbortController = controller;

        set((s) => ({ pending: { ...s.pending, getMe: true } }));
        try {
            const res = await api.get("/me", { signal: controller.signal });
            if (controller.signal.aborted) return;
            set({ user: res.data });
        } catch {
            if (controller.signal.aborted) return;
            set({ user: null });
        } finally {
            if (meAbortController === controller) {
                meAbortController = null;
                set((s) => ({
                    pending: { ...s.pending, getMe: false },
                    isInitialized: true,
                }));
            }
        }
    },

setUser: async (user) => {
    if (get().pending.setUser) return null;

    set((s) => ({
        pending: { ...s.pending, setUser: true },
    }));

    try {
        const res = await api.patch<UserType>("/me", user);

        set({ user: res.data });

        authChannel.postMessage({
            type: "USER_UPDATED",
            user: res.data,
        });

        return res.data;
    } finally {
        set((s) => ({
            pending: { ...s.pending, setUser: false },
        }));
    }
},
}));

authChannel.onmessage = (event) => {
    const { type, user } = event.data ?? {};

    switch (type) {
        case "USER_UPDATED":
            useAuthStore.setState({ user, isInitialized: true });
            break;
        case "LOGOUT":
            useAuthStore.setState({ user: null });
            break;
    }
};

export default useAuthStore;