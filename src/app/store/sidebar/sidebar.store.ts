import { create } from "zustand";

interface Sidebar {
    isOpen: boolean;
    open(): void;
    close(): void;
    toggle(): void;
}

const useSidebarStore = create<Sidebar>((set) => ({
    isOpen: false,

    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSidebarStore;
