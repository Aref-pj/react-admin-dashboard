import { Link, NavLink } from "react-router-dom";
import IconButton from "../../../../shared/components/iconButton/iconButton";

import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMoon } from "react-icons/ai";
import { GoSun } from "react-icons/go";

import { RxHamburgerMenu } from "react-icons/rx";

import useThemeStore from "../../../../app/store/theme/theme.store";
import useAuthStore from "../../../../app/store/auth/auth.store";
import useSidebarStore from "../../../../app/store/sidebar/sidebar.store";

import NotifBox from "./components/notifBox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { markAllNotifs, fetchNotifs, type Notif } from "./api";

export default function Topbar() {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const user = useAuthStore((state) => state.user);

    const isSidebarOpen = useSidebarStore((state) => state.isOpen);
    const toggleSidebar = useSidebarStore((state) => state.toggle);

    const { data: notifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifs,
        refetchOnWindowFocus: false,
    });

    const unreadCount = notifications?.filter((notif) => !notif.read).length ?? 0;

    const queryClient = useQueryClient();
    const readAllNotifs = useMutation({
        mutationFn: markAllNotifs,
        onMutate: async () => {
            const previous = queryClient.getQueryData<Notif[]>(["notifications"]);
            const unreadIds =
                previous?.filter((notif) => !notif.read).map((notif) => notif.id) ??
                [];

            await queryClient.cancelQueries({ queryKey: ["notifications"] });

            if (previous) {
                queryClient.setQueryData<Notif[]>(
                    ["notifications"],
                    previous.map((notif) => ({ ...notif, read: true })),
                );
            }

            return { unreadIds };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return (
        <div className="flex items-center justify-between border-b border-c-border bg-c-surface px-5 py-2 max-sm:px-3">

            <div id="topbar-left" className="flex items-center gap-2">
                <div
                    role="button"
                    onClick={toggleSidebar}
                    className="flex items-center justify-center rounded-full xl:hidden"
                    tabIndex={-1}
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                >
                    <IconButton>
                        <RxHamburgerMenu size={25} />
                    </IconButton>
                </div>

                <NavLink to="/">
                    <h1 className="text-4xl font-extrabold text-c-primary max-lg:text-3xl max-sm:text-2xl">
                        DASHBOARD
                    </h1>
                </NavLink>
            </div>

            <div
                id="topbar-right"
                className="flex items-center justify-end gap-2 max-sm:gap-1"
            >
                <div
                    role="button"
                    onClick={toggleTheme}
                    className="flex items-center justify-center rounded-full"
                    tabIndex={-1}
                >
                    <IconButton>
                        {theme === "light" ? (
                            <AiOutlineMoon size={25} />
                        ) : (
                            <GoSun size={25} />
                        )}
                    </IconButton>
                </div>

                <div className="dropdown dropdown-end sm:dropdown-center h-fit w-fit bg-transparent">
                    <div
                        role="button"
                        className="m-1 h-fit w-fit bg-transparent rounded-full"
                        tabIndex={-1}
                    >
                        <IconButton notifications={unreadCount}>
                            <IoMdNotificationsOutline size={25} />
                        </IconButton>
                    </div>

                    <div
                        tabIndex={0}
                        className="dropdown-content z-1 mt-3 w-90 max-w-[calc(100vw-1.5rem)]"
                    >
                        <NotifBox
                            notifications={notifications ?? []}
                            isLoading={readAllNotifs.isPending}
                            readAllNotifs={readAllNotifs.mutate}
                        />
                    </div>
                </div>

                <Link to="/profile" className="max-[470px]:hidden">
                    <div
                        id="topbar-main-user"
                        className="ml-2 flex cursor-pointer items-center justify-center "
                    >
                        <img
                            className="mr-4 h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-c-border  "
                            src={user?.avatar}
                            alt={user?.name}
                        />

                        <div id="main-user" className="max-sm:hidden">
                            <p className="-mb-1 text-lg max-md:text-md">
                                {user?.name}
                            </p>

                            <p className="text-sm max-md:text-xs text-c-text-muted">
                                {user?.role}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
