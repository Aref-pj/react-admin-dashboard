import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import type { Order } from "../orders.types";
import StatusBadge from "../../../shared/components/statusBadge/statusBadge";

import {
  formatCurrency,
  formatDate,
} from "../orders.utils";

interface OrdersTableProps {
  orders: Order[];
}

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Order>();

export default function OrdersTable({ orders }: OrdersTableProps) {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("id", {
          header: "Order",
          cell: (info) => {
            const order = info.row.original;
            const firstItem = order.items[0];

            return (
              <div className="flex min-w-0 items-center gap-3">
                {firstItem?.image ? (
                  <img
                    src={firstItem.image}
                    alt={firstItem.name}
                    className="size-12 shrink-0 rounded-xl border border-c-border bg-c-background object-contain p-1.5"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-c-primary/10 text-c-primary"
                    aria-hidden="true"
                  >
                    <span className="text-lg">□</span>
                  </div>
                )}

                <div className="min-w-0">
                  <p className="whitespace-nowrap font-medium text-c-text-primary">
                    {info.getValue()}
                  </p>

                  <p className="mt-1 whitespace-nowrap text-xs text-c-text-muted">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            );
          },
        }),

        columnHelper.accessor(
          (row) => row.shippingAddress.fullName,
          {
            id: "customer",
            header: "Customer",
            cell: (info) => (
              <div>
                <p className="whitespace-nowrap text-sm font-medium text-c-text-primary">
                  {info.getValue()}
                </p>

                <p className="mt-1 text-xs text-c-text-muted">
                  ID: {info.row.original.userId}
                </p>
              </div>
            ),
          },
        ),

        columnHelper.accessor("createdAt", {
          header: "Date",
          cell: (info) => (
            <span className="whitespace-nowrap text-sm text-c-text-secondary">
              {formatDate(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("total", {
          header: "Total",
          cell: (info) => (
            <span className="whitespace-nowrap text-sm font-semibold text-c-text-primary">
              {formatCurrency(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("status", {
          header: "Order Status",
          cell: (info) => (
            <div className="flex items-center justify-center">
              <StatusBadge
                status={info.getValue()}
              />
            </div>
          ),
        }),

        columnHelper.accessor("paymentStatus", {
          header: "Payment",
          cell: (info) => (
            <div className="flex items-center justify-center">
              <StatusBadge
                status={info.getValue()}
              />
            </div>
          ),
        }),
      ]),
    [],
  );

  const table = useTable({
    key: "orders-table",
    features,
    columns,
    data: orders,
  });

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-225">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-c-border bg-c-surface"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-c-text-muted ${
                    header.column.id === "id" ||
                    header.column.id === "customer"
                      ? "text-left"
                      : "text-center"
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-c-border transition-colors last:border-b-0 hover:bg-c-surface-hover/50"
            >
              {row.getAllCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`px-5 py-3.5 ${
                    cell.column.id === "id" ||
                    cell.column.id === "customer"
                      ? "text-left"
                      : "text-center"
                  }`}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-c-text-primary">
            No orders found
          </p>

          <p className="mt-1 text-sm text-c-text-muted">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}