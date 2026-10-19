import type { ReactNode } from "react";

interface IconProps {
  className?: string;
  id?: string;
  notifications?: number;
  children?: ReactNode;
  onclick?():  void;
}

export default function IconButton({
  className = "",
  id = "",
  notifications = 0,
  children,
  onclick
}: IconProps) {
  return (
    <button
      onClick={onclick}
      className={`relative cursor-pointer text-c-text-secondary hover:text-c-text hover:bg-c-surface-hover transition 
        active:bg-c-surface-active flex  border-c-border items-center justify-center size-11 border rounded-full ${className}`}
      id={id}
    >
      {children}

      {notifications > 0 && (
        <span
          className=" absolute bg-c-danger rounded-full -top-0.5 -right-0.5
           size-4.25 aspect-square flex items-center justify-center p-px">
          <span
            className="text-blue-50 text-[12px] text-center font-bold">
            {notifications < 10 ? notifications : 9}
          </span>
        </span>
      )}
    </button>
  );
}