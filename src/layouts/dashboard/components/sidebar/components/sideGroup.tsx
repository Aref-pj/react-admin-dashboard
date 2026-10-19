import type { ReactNode } from "react";

interface SideGroupProps {
  title?: string;
  children?: ReactNode;
}

export default function SideGroup({
  title,
  children,
}: SideGroupProps) {
  return (
    <div className="w-full">
      <h4 className="mb-1 pl-3 text-sm text-c-text-disabled ">
        {title}
      </h4>

      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}