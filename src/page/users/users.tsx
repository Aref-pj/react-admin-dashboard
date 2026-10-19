import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LuSearch, LuUserRoundPlus } from "react-icons/lu";
import { Link, useSearchParams } from "react-router-dom";

import useDebounce from "../../shared/hooks/useDebounce";
import UserTable from "./components/userTable";
import { getUsers } from "./api";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("size"));

  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const pageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize)
    ? rawPageSize
    : 10;

  const urlSearch = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (debouncedSearch.trim()) {
        next.set("q", debouncedSearch);
      } else {
        next.delete("q");
      }

      next.set("page", "1");

      return next;
    });
  }, [debouncedSearch, urlSearch, setSearchParams]);

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

    if (changed) {
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, page, pageSize, setSearchParams]);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["users", page, pageSize, debouncedSearch],
    queryFn: () =>
      getUsers({
        page,
        limit: pageSize,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data || data.users.length > 0 || page <= 1) return;

    const lastPage = Math.max(1, Math.ceil(data.total / pageSize));

    if (page <= lastPage) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(lastPage));
      return next;
    });
  }, [data, page, pageSize, setSearchParams]);

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

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-c-text-secondary">
            Users
          </h2>
        </div>

        <Link to="/new-user">
          <div
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-c-primary px-4 py-2.5
              text-sm font-semibold text-white transition hover:opacity-90"
          >
            <LuUserRoundPlus size={18} />
            Add User
          </div>
        </Link>
      </div>

      <div className="rounded-2xl border border-c-border bg-c-surface p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-100">
            <LuSearch
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-c-text-muted"
            />

            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search users..."
              aria-label="Search users"
              className="h-10 w-full rounded-2xl border border-c-border
                bg-c-bg pl-10 pr-4 text-sm text-c-text-primary outline-none
                transition placeholder:text-c-text-muted/60
                focus:border-c-primary"
            />
          </div>

          {isFetching && !isLoading && (
            <span
              role="status"
              aria-label="Updating users"
              className="loading loading-ring loading-xl"
            />
          )}
        </div>

        {isError ? (
          <div className="flex min-h-60 items-center justify-center text-sm text-c-danger">
            Failed to load users.
          </div>
        ) : (
          <UserTable
            users={data?.users ?? []}
            total={data?.total ?? 0}
            page={page}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </section>
  );
}
