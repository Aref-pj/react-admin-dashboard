import { LuSearch, LuX } from "react-icons/lu";

import Select from "../../../shared/components/select/select";

import type {
  OrderStatus,
  PaymentStatus,
} from "../orders.types";

interface OrdersFiltersProps {
  search: string;
  status: OrderStatus | "";
  paymentStatus: PaymentStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "") => void;
  onPaymentStatusChange: (value: PaymentStatus | "") => void;
  onReset: () => void;
}

const orderStatuses = [
  "",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const satisfies readonly (OrderStatus | "")[];

const paymentStatuses = [
  "",
  "pending",
  "approved",
  "declined",
  "refunded",
] as const satisfies readonly (PaymentStatus | "")[];

const formatStatus = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

export default function OrdersFilters({
  search,
  status,
  paymentStatus,
  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onReset,
}: OrdersFiltersProps) {
  const hasFilters = Boolean(search || status || paymentStatus);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-c-border bg-c-surface p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-0 flex-1">
        <label
          htmlFor="orders-search"
          className="mb-2 block text-xs font-semibold text-c-text-muted"
        >
          Search orders
        </label>

        <div className="relative">
          <LuSearch
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-c-text-muted"
          />

          <input
            id="orders-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Order ID or customer..."
            className="input input-bordered h-10 w-full rounded-lg border-c-border bg-c-background pl-10 text-sm text-c-text"
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <Select
          id="orders-status"
          label="Order status"
          options={orderStatuses}
          value={status}
          onChange={onStatusChange}
          format={(value) =>
            value ? formatStatus(value) : "All statuses"
          }
          preserveCase
        />
      </div>

      <div className="w-full sm:w-48">
        <Select
          id="orders-payment-status"
          label="Payment status"
          options={paymentStatuses}
          value={paymentStatus}
          onChange={onPaymentStatusChange}
          format={(value) =>
            value ? formatStatus(value) : "All payments"
          }
          preserveCase
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm text-c-text-muted
             transition-colors hover:bg-c-background hover:text-c-text"
        >
          <LuX size={16} />
          Reset
        </button>
      )}
    </div>
  );
}