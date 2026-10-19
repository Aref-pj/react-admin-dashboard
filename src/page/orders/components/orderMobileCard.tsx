import { LuMapPin, LuPackage } from "react-icons/lu";

import type { Order } from "../orders.types";
import StatusBadge from "../../../shared/components/statusBadge/statusBadge";

import {
  formatCurrency,
  formatDate,
} from "../orders.utils";

interface OrderMobileCardProps {
  order: Order;
}

export default function OrderMobileCard({
  order,
}: OrderMobileCardProps) {
  const firstItem = order.items[0];

  return (
    <article className="min-w-0 rounded-2xl border border-c-border bg-c-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="wrap-break-word font-semibold text-c-text">
            {order.id}
          </p>

          <p className="mt-1 text-xs text-c-text-muted">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <p className="shrink-0 text-right font-semibold text-c-text">
          {formatCurrency(order.total)}
        </p>
      </div>

      <div className="my-4 flex min-w-0 items-center gap-3">
        {firstItem?.image ? (
          <img
            src={firstItem.image}
            alt={firstItem.name}
            className="size-13 shrink-0 rounded-xl border border-c-border bg-c-background object-contain p-1.5"
            loading="lazy"
          />
        ) : (
          <div
            className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-c-primary/10 text-c-primary"
            aria-hidden="true"
          >
            <LuPackage size={22} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="wrap-break-word text-sm font-medium text-c-text">
            {firstItem?.name ?? "No products"}
          </p>

          <p className="mt-1 text-xs text-c-text-muted">
            {order.items.length}{" "}
            {order.items.length === 1 ? "item" : "items"}
            {order.items.length > 1
              ? ` · +${order.items.length - 1} more`
              : ""}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-start gap-2 border-t border-c-border pt-3">
        <LuMapPin
          size={16}
          className="mt-0.5 shrink-0 text-c-text-muted"
        />

        <div className="min-w-0 flex-1 text-xs text-c-text-muted">
          <p className="wrap-break-word font-medium text-c-text">
            {order.shippingAddress.fullName}
          </p>

          <p className="mt-1 wrap-break-word">
            {[
              order.shippingAddress.city,
              order.shippingAddress.country,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-c-border pt-3">
        <StatusBadge
          status={order.status}
        />

        <StatusBadge
          status={order.paymentStatus}
        />
      </div>
    </article>
  );
}