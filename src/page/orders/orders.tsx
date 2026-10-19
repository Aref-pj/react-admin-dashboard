
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuRefreshCw } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";

import useDebounce from "../../shared/hooks/useDebounce";
import { ordersApi } from "./api";

import type {
  OrderStatus,
  PaymentStatus,
} from "./orders.types";

import OrdersFilters from "./components/ordersFilters";
import OrdersTable from "./components/ordersTable";
import OrderMobileCard from "./components/orderMobileCard";
import Pagination from "../../shared/components/pagination/pagination";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL.
  const search = searchParams.get("q") ?? "";

  const status =
    (searchParams.get("status") as OrderStatus | null) ?? "";

  const paymentStatus =
    (searchParams.get("paymentStatus") as PaymentStatus | null) ?? "";

  // Read pagination from URL.
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
    data: allOrders = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getAll,
    retry: false,
  });

  const filteredOrders = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return allOrders.filter((order) => {
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.userId.toLowerCase().includes(term) ||
        order.shippingAddress.fullName.toLowerCase().includes(term) ||
        order.shippingAddress.phone.includes(term) ||
        order.shippingAddress.city.toLowerCase().includes(term) ||
        order.shippingAddress.country.toLowerCase().includes(term) ||
        (order.trackingNumber ?? "").toLowerCase().includes(term) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(term),
        );

      const matchesStatus =
        !status || order.status === status;

      const matchesPayment =
        !paymentStatus || order.paymentStatus === paymentStatus;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [allOrders, debouncedSearch, status, paymentStatus]);

  const totalItems = filteredOrders.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  // Normalize URL pagination params in one update.
  useEffect(() => {
    if (isPending) return;

    if (page > totalPages) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("page", String(totalPages));
          return next;
        },
        { replace: true },
      );
    }
  }, [
    isPending,
    page,
    totalPages,
    setSearchParams,
  ]);

  const orders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredOrders.slice(
      startIndex,
      startIndex + pageSize,
    );
  }, [filteredOrders, currentPage, pageSize]);

  // Update URL params and reset pagination when filters change.
  function setParam(
    name: string,
    value: string,
    replace = false,
  ) {
    setSearchParams(
      (prev) => {
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
      },
      { replace },
    );
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
    setParam("q", value, true);
  }

  function handleStatusChange(value: OrderStatus | "") {
    setParam("status", value);
  }

  function handlePaymentStatusChange(
    value: PaymentStatus | "",
  ) {
    setParam("paymentStatus", value);
  }

  function resetFilters() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      next.delete("q");
      next.delete("status");
      next.delete("paymentStatus");
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
            Orders
          </h1>

          <p className="mt-1 text-sm text-c-text-muted">
            Manage and track customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-c-border bg-c-surface px-3 py-2 text-sm text-c-text-muted sm:self-auto">
          <span className="font-semibold text-c-text">
            {totalItems}
          </span>
          Total orders
        </div>
      </div>

      {/* Filters */}
      <OrdersFilters
        search={search}
        status={status}
        paymentStatus={paymentStatus}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={handlePaymentStatusChange}
        onReset={resetFilters}
      />

      {/* Orders */}
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
              Could not load orders
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
            <OrdersTable orders={orders} />

            {/* Mobile cards */}
            <div className="space-y-3 p-3 md:hidden">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <OrderMobileCard
                    key={order.id}
                    order={order}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="font-medium text-c-text">
                    No orders found
                  </p>

                  <p className="mt-1 text-sm text-c-text-muted">
                    Try changing your search or filters.
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
