import { Outlet, Navigate, useLocation, useNavigation } from "react-router-dom";
import { useLayoutEffect, useEffect, useRef } from "react";

import "./dashboard.css"
import Topbar from "./components/topbar/topbar";
import Sidebar from "./components/sidebar/sidebar";

import useAuthStore from "../../app/store/auth/auth.store";

export default function Dashboard() {
    const getMe = useAuthStore((state) => state.getMe);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const user = useAuthStore((state) => state.user);

    const mainRef = useRef<HTMLElement>(null);
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        mainRef.current?.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        if (!isInitialized) {
            getMe();
        }
    }, [isInitialized, getMe]);

    const navigation = useNavigation();
    const isNavigating = navigation.state !== "idle";

    if (!isInitialized) {
        return (
            <span className="loading loading-dots loading-xl absolute top-1/2 left-1/2" />
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="h-full flex flex-col">
            {isNavigating && (
                <div className="h-0.75 absolute animate-[loading-bar_1.4s_linear_infinite] rounded-full bg-c-primary" />
            )}

            <Topbar />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar />

                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-6 max-md:p-3 scrollbar-thumb-c-primary"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}