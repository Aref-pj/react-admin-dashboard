import { useEffect, useRef, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { LuSearch, LuCheckCheck } from "react-icons/lu";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";

import useDebounce from "../../shared/hooks/useDebounce";
import {
  deleteNotification,
  getAllUnreadNotifications,
  getNotifications,
  markNotificationRead,
  type GetNotificationsResponse,
  type Notification,
  type NotificationFilter,
} from "./api";

import NotificationItem from "./components/notificationItem";
import NotificationSkeleton from "./components/notificationSkeleton";
import Pagination from "../../shared/components/pagination/pagination";

const FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "order", label: "Orders" },
  { value: "user", label: "Users" },
  { value: "payment", label: "Payments" },
  { value: "warning", label: "Warnings" },
  { value: "info", label: "System" },
];

const VALID_PAGE_SIZES = [5, 10, 20];

export default function Notifications() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("size"));
  const rawFilter = searchParams.get("filter");

  const page =
    Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const pageSize = VALID_PAGE_SIZES.includes(rawPageSize)
    ? rawPageSize
    : 10;

  const validFilters: NotificationFilter[] = FILTERS.map(
    (item) => item.value,
  );

  const filter: NotificationFilter = validFilters.includes(
    rawFilter as NotificationFilter,
  )
    ? (rawFilter as NotificationFilter)
    : "all";

  const queryKey = [
    "notifications",
    page,
    pageSize,
    filter,
    debouncedSearch,
  ] as const;

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getNotifications({
        page,
        limit: pageSize,
        filter,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () =>
      getNotifications({
        page: 1,
        limit: 1,
        filter: "unread",
      }),
  });

  const unreadCount = unreadData?.total ?? 0;
  const notifications = data?.notifications ?? [];
  const total = data?.total ?? 0;

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let changed = false;

    if (searchParams.get("page") !== String(page)) {
      next.set("page", String(page));
      changed = true;
    }

    if (searchParams.get("size") !== String(pageSize)) {
      next.set("size", String(pageSize));
      changed = true;
    }

    if (searchParams.get("filter") !== filter) {
      next.set("filter", filter);
      changed = true;
    }

    if (changed) {
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, page, pageSize, filter, setSearchParams]);

  const previousSearch = useRef(debouncedSearch);

  useEffect(() => {
    if (previousSearch.current === debouncedSearch) return;

    previousSearch.current = debouncedSearch;

    if (page === 1) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  }, [debouncedSearch, page, setSearchParams]);

  useEffect(() => {
    if (!data || notifications.length > 0 || page <= 1) return;

    const lastPage = Math.max(1, Math.ceil(total / pageSize));

    if (page <= lastPage) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(lastPage));
      return next;
    });
  }, [
    data,
    total,
    notifications.length,
    page,
    pageSize,
    setSearchParams,
  ]);

  const readMutation = useMutation({
    mutationFn: markNotificationRead,

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      const previous =
        queryClient.getQueryData<GetNotificationsResponse>(queryKey);

      if (previous) {
        queryClient.setQueryData<GetNotificationsResponse>(queryKey, {
          ...previous,
          notifications: previous.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification,
          ),
        });
      }

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      const previous =
        queryClient.getQueryData<GetNotificationsResponse>(queryKey);

      if (previous) {
        queryClient.setQueryData<GetNotificationsResponse>(queryKey, {
          ...previous,
          total: Math.max(0, previous.total - 1),
          notifications: previous.notifications.filter(
            (notification) => notification.id !== id,
          ),
        });
      }

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const readAllMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = await getAllUnreadNotifications();

      await Promise.all(
        unreadNotifications.map((notification) =>
          markNotificationRead(notification.id),
        ),
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  function handlePageChange(newPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  }

  function handlePageSizeChange(newSize: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("size", String(newSize));
      next.set("page", "1");
      return next;
    });
  }

  function handleFilterChange(newFilter: NotificationFilter) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("filter", newFilter);
      next.set("page", "1");
      return next;
    });
  }

  const activeFilter = FILTERS.find((item) => item.value === filter);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-c-text-secondary">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-c-text-muted">
            {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => readAllMutation.mutate()}
          disabled={unreadCount === 0 || readAllMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl
            border border-c-border bg-c-surface px-4 py-2.5 text-sm font-semibold
            text-c-text-secondary transition hover:bg-c-surface-hover
            hover:text-c-text disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuCheckCheck
            size={18}
            className={readAllMutation.isPending ? "animate-pulse" : ""}
          />

          {readAllMutation.isPending ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="rounded-2xl border border-c-border bg-c-surface p-4">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-100">
            <LuSearch
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-c-text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              aria-label="Search notifications"
              className="h-10 w-full rounded-2xl border border-c-border
                bg-c-bg pl-10 pr-4 text-sm text-c-text-primary outline-none
                transition placeholder:text-c-text-muted/60
                focus:border-c-primary"
            />
          </div>

          {isFetching && !isLoading && (
            <span
              role="status"
              aria-label="Updating notifications"
              className="loading loading-ring loading-xl"
            />
          )}
        </div>

        <div className="mb-2 pb-3 flex gap-2 overflow-x-auto">
          {FILTERS.map((item) => {
            const isActive = item.value === filter;

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleFilterChange(item.value)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm
                  font-medium transition-colors ${isActive
                    ? "bg-c-primary text-white"
                    : "bg-c-bg text-c-text-secondary hover:bg-c-surface-hover"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {isError ? (
          <div className="flex min-h-60 items-center justify-center text-sm text-c-danger">
            Failed to load notifications.
          </div>
        ) : isLoading ? (
          <NotificationSkeleton />
        ) : notifications.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-c-border mb-4">
            {notifications.map((notification: Notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                expanded={expandedId === notification.id}
                onToggleExpand={() =>
                  setExpandedId((prev) =>
                    prev === notification.id ? null : notification.id,
                  )
                }
                onRead={readMutation.mutate}
                onDelete={(id) => {
                  setExpandedId(null);
                  deleteMutation.mutate(id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-c-bg">
              <IoInformationCircleOutline
                size={24}
                aria-hidden="true"
                className="text-c-text-muted"
              />
            </div>

            <p className="font-medium text-c-text-primary">
              {search
                ? "No notifications found"
                : filter === "all"
                  ? "No notifications"
                  : `No ${activeFilter?.label.toLowerCase()} notifications`}
            </p>

            <p className="mt-1 text-sm text-c-text-muted">
              {search
                ? "Try changing your search query."
                : filter === "all"
                  ? "You're all caught up. New activity will appear here."
                  : "Try selecting a different filter."}
            </p>
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

      </div>
    </section>
  );
}
