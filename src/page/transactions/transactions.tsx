import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuRefreshCw } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";

import { transactionsApi } from "./api";
import type { TransactionStatus } from "./transactions.type";

import TransactionsFilters from "./components/transactionsFilter";
import TransactionsTable from "./components/transactionsTable";
import TransactionMobileCard from "./components/transactionMobileCard";

import useDebounce from "../../shared/hooks/useDebounce";
import Pagination from "../../shared/components/pagination/pagination";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";

  const status =
    (searchParams.get("status") as TransactionStatus | null) ?? "";

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("size"));

  const page =
    Number.isSafeInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const pageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize)
    ? rawPageSize
    : 10;

  const debouncedSearch = useDebounce(search, 400);

  const {
    data: allTransactions = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsApi.getAll,
    retry: false,
  });

  const filteredTransactions = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return allTransactions.filter((transaction) => {
      const matchesSearch =
        !term ||
        transaction.id.toLowerCase().includes(term) ||
        transaction.userId.toLowerCase().includes(term) ||
        transaction.customer.toLowerCase().includes(term) ||
        transaction.orderId.toLowerCase().includes(term) ||
        transaction.status.toLowerCase().includes(term);

      const matchesStatus =
        !status || transaction.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [allTransactions, debouncedSearch, status]);

  const totalItems = filteredTransactions.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  const transactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredTransactions.slice(
      startIndex,
      startIndex + pageSize,
    );
  }, [filteredTransactions, currentPage, pageSize]);

  function setParam(name: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set(name, value);
      } else {
        next.delete(name);
      }

      if (name !== "page") {
        next.set("page", "1");
      }

      return next;
    });
  }

  function handlePageChange(newPage: number) {
    setParam("page", String(newPage));
  }

  function handlePageSizeChange(newSize: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("size", String(newSize));
      next.set("page", "1");
      return next;
    });
  }

  function handleSearchChange(value: string) {
    setParam("q", value);
  }

  function handleStatusChange(value: TransactionStatus | "") {
    setParam("status", value);
  }

  function resetFilters() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      next.delete("q");
      next.delete("status");
      next.set("page", "1");

      return next;
    });
  }

  useEffect(() => {
  if (
    !searchParams.has("page") ||
    !searchParams.has("size")
  ) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (!next.has("page")) {
          next.set("page", "1");
        }

        if (!next.has("size")) {
          next.set("size", "10");
        }

        return next;
      },
      { replace: true },
    );
  }
}, [searchParams, setSearchParams]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-c-text-secondary sm:text-2xl">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-c-text-muted">
            Monitor payments and track transaction statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-c-border bg-c-surface px-3 py-2 text-sm text-c-text-muted sm:self-auto">
          <span className="font-semibold text-c-text">
            {totalItems}
          </span>
          Transactions
        </div>
      </div>

      <TransactionsFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onReset={resetFilters}
      />

      <div className="overflow-hidden rounded-2xl border border-c-border bg-c-surface">
        {isPending ? (
          <div className="space-y-4 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-c-background"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <p className="font-semibold text-c-text">
              Could not load transactions
            </p>

            <p className="mt-2 text-sm text-c-text-muted">
              Check your connection and try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-c-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <LuRefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : (
          <>
            <TransactionsTable transactions={transactions} />

            <div className="space-y-3 p-3 md:hidden">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TransactionMobileCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="font-medium text-c-text">
                    No transactions found
                  </p>

                  <p className="mt-1 text-sm text-c-text-muted">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </div>

            {totalItems > 0 && (
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
