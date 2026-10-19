import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import SideGroup from "./components/sideGroup";
import SideItem from "./components/sideItem";

import { RxDashboard } from "react-icons/rx";
import { LuUserRoundPen } from "react-icons/lu";
import { LuUsersRound } from "react-icons/lu";
import { TbUsersPlus } from "react-icons/tb";
import { LuShoppingBag } from "react-icons/lu";
import { LuClipboardPen } from "react-icons/lu";
import { LuBadgeDollarSign } from "react-icons/lu";
import { LuBadgeAlert } from "react-icons/lu";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";

import useAuthStore from "../../../../app/store/auth/auth.store";
import useSidebarStore from "../../../../app/store/sidebar/sidebar.store";

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);

  const isOpen = useSidebarStore((state) => state.isOpen);
  const close = useSidebarStore((state) => state.close);

  const { pathname } = useLocation();

  // Dismiss the drawer after navigation (mobile/tablet only; harmless on desktop)
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Dismiss the drawer with Escape
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return (
    <>
      {/* Backdrop: fades in below xl, inert on desktop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]
          transition-opacity duration-300 ease-in-out xl:hidden
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        aria-label="Main navigation"
        className={`w-70 shrink-0 flex flex-col justify-between bg-c-surface py-5
          border-r border-c-border overflow-y-auto
          max-xl:fixed max-xl:inset-y-0 max-xl:left-0 max-xl:z-60 max-xl:border-r-0
          max-xl:shadow-2xl max-xl:transition-transform max-xl:duration-300
          max-xl:ease-in-out
          ${isOpen ? "max-xl:translate-x-0" : "max-xl:-translate-x-full"}`}
      >
        <div className="flex w-full flex-col gap-2">
          <SideGroup title="Dashboard">
            <SideItem
              title="Home"
              path="/"
              onClick={close}
            icon={<RxDashboard size={20} className="text-c-text-secondary" />}
            />
            <SideItem
              title="Profile"
              path="/profile"
              onClick={close}
            icon={<LuUserRoundPen size={20} className="text-c-text-secondary" />}
            />
          </SideGroup>
          <SideGroup title="Quick Menu">
            <SideItem
              title="Users"
              path="/users"
              onClick={close}
            icon={<LuUsersRound size={20} className="text-c-text-secondary" />}
            />
            <SideItem
              title="New User"
              path="/new-user"
              onClick={close}
            icon={<TbUsersPlus size={20} className="text-c-text-secondary" />}
            />
            <SideItem
              title="Products"
              path="/products"
              onClick={close}
            icon={<LuShoppingBag size={20} className="text-c-text-secondary" />}
            />
            <SideItem
              title="Orders"
              path="/orders"
              onClick={close}
            icon={<LuClipboardPen size={20} className="text-c-text-secondary" />}
            />
            <SideItem
              title="Transactions"
              path="/transactions"
              onClick={close}
            icon={<LuBadgeDollarSign size={20} className="text-c-text-secondary" />}
            />
          </SideGroup>
          <SideGroup title="Staff">
            <SideItem
              title="Notifications"
              path="/notifications"
              onClick={close}
            icon={<LuBadgeAlert size={20} className="text-c-text-secondary" />}
            />
            <SideItem
              title="Manage"
              path="/manage"
              onClick={close}
            icon={<LuBriefcaseBusiness size={20} className="text-c-text-secondary" />}
            />
          </SideGroup>
        </div>

        <div className="w-full px-3">
          <button
            onClick={logout}
            className=" flex items-center justify-center gap-1 w-full mt-4 px-4 py-2.5 rounded-xl text-c-text-secondary
           bg-gray-500/10 border border-gray-500/20 font-medium text-sm transition-all duration-200 hover:text-gray-50 
           hover:bg-c-danger  hover:border-c-danger active:bg-red-700"
          >
            <HiOutlineLogout size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
