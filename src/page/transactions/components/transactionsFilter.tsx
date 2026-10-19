import { LuSearch, LuX } from "react-icons/lu";

import Select from "../../../shared/components/select/select";

import type { TransactionStatus } from "../transactions.type";

interface TransactionsFiltersProps {
  search: string;
  status: TransactionStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TransactionStatus | "") => void;
  onReset: () => void;
}

const transactionStatuses = [
  "",
  "pending",
  "approved",
  "declined",
] as const satisfies readonly (TransactionStatus | "")[];

const formatStatus = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

export default function TransactionsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: TransactionsFiltersProps) {
  const hasFilters = Boolean(search || status);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-c-border bg-c-surface p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-0 flex-1">
        <label
          htmlFor="transactions-search"
          className="mb-2 block text-xs font-semibold text-c-text-muted"
        >
          Search transactions
        </label>

        <div className="relative">
          <LuSearch
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-c-text-muted"
          />

          <input
            id="transactions-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Transaction ID, customer or order..."
            className="input input-bordered h-10 w-full rounded-lg border-c-border bg-c-background pl-10 text-sm text-c-text"
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <Select
          id="transactions-status"
          label="Transaction status"
          options={transactionStatuses}
          value={status}
          onChange={onStatusChange}
          format={(value) =>
            value ? formatStatus(value) : "All statuses"
          }
          preserveCase
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm text-c-text-muted transition-colors hover:bg-c-background hover:text-c-text"
        >
          <LuX size={16} />
          Reset
        </button>
      )}
    </div>
  );
}