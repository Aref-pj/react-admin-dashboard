import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SideItemProps {
  title?: string;
  path?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function SideItem({
  title,
  path = "/",
  icon,
  className = "",
  onClick,
}: SideItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center px-7 py-2 text-c-text-secondary
        transition-colors duration-150 font-normal
         hover:text-c-text-primary
        ${isActive ? `bg-c-surface-active text-c-text-primary before:absolute before:left-0 
            before:h-full before:bg-c-primary before:w-1.25` : "hover:bg-c-surface-hover"}
        ${className}`
      }
    >
      {icon && (
        <span className="mr-2 flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="text-[18px] text-c-text-secondary text-center">
        {title}
      </span>
    </NavLink>
  );
}