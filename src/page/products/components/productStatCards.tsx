import type { ReactNode } from "react";
import {
  LuBox,
  LuCircleCheck,
  LuTriangleAlert,
  LuWallet,
} from "react-icons/lu";

import type { Product } from "../api";
import {
  calculateInventoryValue,
  countLowStock,
  formatCompactPrice,
  formatNumber,
} from "../utils";

interface ProductStatCardsProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

interface StatConfig {
  title: string;
  value: string;
  icon: ReactNode;
  iconClass: string;
}

function buildStats(products: Product[]): StatConfig[] {
  const activeCount = products.filter(
    (product) => product.status === "active",
  ).length;

  return [
    {
      title: "Total Products",
      value: formatNumber(products.length),
      icon: <LuBox size={22} />,
      iconClass: "bg-c-primary/10 text-c-primary",
    },
    {
      title: "Active Products",
      value: formatNumber(activeCount),
      icon: <LuCircleCheck size={22} />,
      iconClass: "bg-c-success/10 text-c-success",
    },
    {
      title: "Low Stock",
      value: formatNumber(countLowStock(products)),
      icon: <LuTriangleAlert size={22} />,
      iconClass: "bg-c-warning/10 text-c-warning",
    },
    {
      title: "Inventory Value",
      value: formatCompactPrice(calculateInventoryValue(products)),
      icon: <LuWallet size={22} />,
      iconClass: "bg-c-secondary/10 text-c-secondary",
    },
  ];
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-c-border bg-c-surface p-4 sm:p-5">
      <div className="mb-4 h-4 w-28 animate-pulse rounded bg-c-bg" />
      <div className="h-8 w-32 animate-pulse rounded bg-c-bg" />
    </div>
  );
}

export default function ProductStatCards({
  products,
  isLoading,
}: ProductStatCardsProps) {
  if (isLoading || !products) {
    return (
      <div
        className="grid grid-cols-2 gap-3 lg:grid-cols-4 max-xs:grid-cols-1"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const stats = buildStats(products);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 max-xs:grid-cols-1">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex items-center justify-between rounded-2xl border border-c-border
            bg-c-surface p-4 sm:p-5 relative"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-medium text-c-text-muted max-[420px]:w-3/4">
              {stat.title}
            </span>

            <span className="text-2xl font-extrabold tracking-tight text-c-text font-manrope">
              {stat.value}
            </span>
          </div>

          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl absolute 
              max-[1000px]:right-3 max-[1000px]:top-3 right-4 top-4
              ${stat.iconClass}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
