
import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import type { Transaction } from "../transactions.type";

import StatusBadge from "../../../shared/components/statusBadge/statusBadge";

import {
  formatTransactionAmount,
  formatTransactionDateTime,
} from "../transactions.utils";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, Transaction>();

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("customer", {
          header: "Customer",
          cell: (info) => (
            <div className="flex items-center gap-3">
              <img
                src={
                  info.row.original.avatar || "/images/users/user1.jpg"
                }
                alt=""
                className="size-9 rounded-full bg-c-background object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-c-text">
                  {info.getValue()}
                </p>

                <p className="mt-0.5 text-xs text-c-text-muted">
                  ID: {info.row.original.userId}
                </p>
              </div>
            </div>
          ),
        }),

        columnHelper.accessor("id", {
          header: "Transaction",
          cell: (info) => (
            <p className="font-semibold text-c-text text-center w-full!">
              {info.getValue()}
            </p>
          ),
        }),

        columnHelper.accessor("orderId", {
          header: "Order ID",
          cell: (info) => (
            <span className="text-sm font-medium text-c-text-secondary">
              {info.getValue()}
            </span>
          ),
        }),

        columnHelper.accessor("createdAt", {
          header: "Date",
          cell: (info) => (
            <span className="whitespace-nowrap text-sm text-c-text-muted">
              {formatTransactionDateTime(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("amount", {
          header: "Amount",
          cell: (info) => (
            <span className="whitespace-nowrap text-sm font-semibold text-c-text">
              {formatTransactionAmount(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("status", {
          header: "Status",
          cell: (info) => (
            <div className="flex items-center justify-center">
              <StatusBadge status={info.getValue()} />
            </div>
          ),
        }),
      ]),
    [],
  );

  const table = useTable({
    key: "transactions-table",
    features,
    columns,
    data: transactions,
  });

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-190 text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-c-border bg-c-surface"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-c-text-muted
                     ${header.column.id === "customer" ? "text-left" : "text-center"
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

        <tbody className="divide-y divide-c-border">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="transition-colors hover:bg-c-surface-hover/50"
            >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="px-5 py-4">
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

      {transactions.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-medium text-c-text">
            No transactions found
          </p>

          <p className="mt-1 text-sm text-c-text-muted">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
