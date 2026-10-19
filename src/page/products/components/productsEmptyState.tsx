import { Link } from "react-router-dom";
import { LuPackageSearch, LuSearch, LuShoppingBag } from "react-icons/lu";

interface ProductsEmptyStateProps {
  variant: "empty-inventory" | "no-results";
  onClearFilters: () => void;
}

export default function ProductsEmptyState({
  variant,
  onClearFilters,
}: ProductsEmptyStateProps) {
  const isEmptyInventory = variant === "empty-inventory";

  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-c-bg">
        {isEmptyInventory ? (
          <LuPackageSearch
            size={22}
            className="text-c-text-muted"
          />
        ) : (
          <LuSearch
            size={22}
            className="text-c-text-muted"
          />
        )}
      </div>

      <p className="font-medium text-c-text-primary">
        {isEmptyInventory ? "No products yet" : "No products found"}
      </p>

      <p className="mt-1 max-w-sm text-sm text-c-text-muted">
        {isEmptyInventory
          ? "Your inventory is empty. Add your first product to start tracking sales."
          : "No products match your current filters. Try adjusting or clearing them."}
      </p>

      <div className="mt-5">
        {isEmptyInventory ? (
          <Link
            to="/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl
              bg-c-primary px-4 py-2.5 text-sm font-semibold text-white
              transition hover:opacity-90"
          >
            <LuShoppingBag size={18} />
            Add Product
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl
              border border-c-border bg-c-surface px-4 py-2.5 text-sm
              font-semibold text-c-text-secondary transition
              hover:bg-c-surface-hover hover:text-c-text"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
