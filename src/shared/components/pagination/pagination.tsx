import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20];

type PageItem = number | "ellipsis";

function getPageItems(
  currentPage: number,
  pageCount: number,
): PageItem[] {
  if (pageCount <= 0) return [];

  const visible = new Set<number>();

  for (let i = 1; i <= pageCount; i++) {
    if (
      i === 1 ||
      i === pageCount ||
      Math.abs(i - currentPage) <= 1
    ) {
      visible.add(i);
    }
  }

  const sorted = [...visible].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let previous = 0;

  for (const current of sorted) {
    if (previous && current - previous > 1) {
      items.push("ellipsis");
    }

    items.push(current);
    previous = current;
  }

  return items;
}

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pageCount = Math.ceil(total / pageSize);
  const pageItems = getPageItems(page, pageCount);

  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

  const [openPageSize, setOpenPageSize] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openPageSize) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        pageSizeRef.current &&
        !pageSizeRef.current.contains(event.target as Node)
      ) {
        setOpenPageSize(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openPageSize]);

  const pageSizeOptions = useMemo(() => {
    return [...new Set([...PAGE_SIZE_OPTIONS, pageSize])].sort(
      (a, b) => a - b,
    );
  }, [pageSize]);

  return (
    <div className="flex flex-col gap-4 border-t border-c-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-c-text-muted">
        <label htmlFor="orders-page-size" className="hidden sm:inline">
          Rows per page
        </label>

        <div ref={pageSizeRef} className="relative">
          <button
            type="button"
            id="orders-page-size"
            aria-haspopup="listbox"
            aria-expanded={openPageSize}
            onClick={() => setOpenPageSize((previous) => !previous)}
            className="flex h-9 w-20 cursor-pointer items-center justify-between rounded-lg border border-c-border bg-c-surface 
            pl-3 pr-2 text-sm text-c-text-primary outline-none transition-colors focus:border-c-primary"
          >
            <span>{pageSize}</span>

            <LuChevronDown
              size={14}
              className={`text-c-text-muted transition-transform duration-200 ${
                openPageSize ? "rotate-180" : ""
              }`}
            />
          </button>

          {openPageSize && (
            <ul
              role="listbox"
              aria-label="Rows per page"
              className="absolute bottom-full left-0 z-10 mb-1 w-full overflow-hidden rounded-lg border border-c-border 
                bg-c-surface p-1 shadow-lg"
            >
              {pageSizeOptions.map((size) => (
                <li key={size} role="option" aria-selected={size === pageSize}>
                  <button
                    type="button"
                    onClick={() => {
                      onPageSizeChange(size);
                      setOpenPageSize(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-c-primary
                             hover:text-white ${
                      size === pageSize
                        ? "bg-c-primary/10 font-medium text-c-primary"
                        : "text-c-text-primary"
                    }`}
                  >
                    {size}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="whitespace-nowrap">
          {firstRow}-{lastRow} of {total}
        </span>
      </div>

      <nav
        aria-label="Orders pagination"
        className="flex flex-wrap items-center justify-center gap-1 sm:justify-end"
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex size-9 items-center justify-center rounded-lg text-c-text-secondary transition-colors
             hover:bg-c-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuChevronLeft size={18} />
        </button>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-c-text-muted"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={page === item ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`size-9 rounded-lg text-sm font-medium transition-colors ${
                page === item
                  ? "bg-c-primary text-white"
                  : "text-c-text-secondary hover:bg-c-background"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={pageCount === 0 || page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="flex size-9 items-center justify-center rounded-lg text-c-text-secondary transition-colors
             hover:bg-c-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuChevronRight size={18} />
        </button>
      </nav>
    </div>
  );
}