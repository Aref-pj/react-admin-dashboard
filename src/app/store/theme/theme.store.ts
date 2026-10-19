import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeType = "light" | "dark";

interface Theme {
    theme: ThemeType
    setTheme(theme: ThemeType): void;
    toggleTheme(): void;
}

const useThemeStore = create<Theme>()(
    persist(
        (set, get) => ({
            theme: "light",

            setTheme: (theme: ThemeType) => {
                set({ theme });
            },

            toggleTheme: () => {
                const tm = get().theme;
                set({ theme: tm === "light" ? "dark" : "light" });
            }
        }),

        {
            name: "theme",
        }
    )
);

export default useThemeStore;