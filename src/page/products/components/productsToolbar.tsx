import { LuSearch, LuX } from "react-icons/lu";

import Select from "../../../shared/components/select/select";
import type { Brand, Category, ProductStatus } from "../api";
import {
  SORT_OPTIONS,
  STOCK_FILTERS,
  type SortOption,
  type StockFilter,
} from "../utils";

export type StatusFilter = ProductStatus | "all";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

interface ProductsToolbarProps {
  categories: Category[];
  brands: Brand[];
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  brandId: string;
  onBrandChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  stock: StockFilter;
  onStockChange: (value: StockFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function ProductsToolbar({
  categories,
  brands,
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  brandId,
  onBrandChange,
  status,
  onStatusChange,
  stock,
  onStockChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: ProductsToolbarProps) {
  const availableBrands =
    categoryId === "all"
      ? brands
      : brands.filter((brand) => brand.categoryIds.includes(categoryId));

  const categoryOptions = ["all", ...categories.map((category) => category.id)];

  const brandOptions = [
    "all",
    ...availableBrands.map((brand) => brand.id),
  ];

  const formatCategory = (value: string) =>
    value === "all"
      ? "All Categories"
      : categories.find((category) => category.id === value)?.name ?? value;

  const formatBrand = (value: string) =>
    value === "all"
      ? "All Brands"
      : brands.find((brand) => brand.id === value)?.name ?? value;

  const formatSort = (value: SortOption) =>
    SORT_OPTIONS.find((option) => option.value === value)?.label ?? value;

  const formatStatus = (value: StatusFilter) =>
    STATUS_FILTERS.find((option) => option.value === value)?.label ?? value;

  const formatStock = (value: StockFilter) =>
    STOCK_FILTERS.find((option) => option.value === value)?.label ?? value;

  return (
    <div className="rounded-2xl border border-c-border bg-c-surface px-4 pt-2 pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Search */} 
        <div className="form-control w-full lg:max-w-72">
          <label
            htmlFor="products-search"
            className="label"
          >
            <span className="label-text text-xs font-semibold text-c-text-muted">
              Search
            </span>
          </label>

          <div className="relative">
            <LuSearch
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-c-text-muted z-10"
            />

            <input
              id="products-search"
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name or brand..."
              aria-label="Search products"
              className="input input-bordered h-10 w-full rounded-lg
                border-c-border bg-c-background pl-10 text-sm
                font-normal text-c-text outline-none transition
                placeholder:text-c-text-muted/60
                focus:border-c-primary focus:ring-2 focus:ring-c-primary/15"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 xl:grid-cols-5">
          <Select
            label="Category"
            id="filter-category"
            options={categoryOptions}
            value={categoryId}
            onChange={onCategoryChange}
            format={formatCategory}
            preserveCase
          />

          <Select
            label="Brand"
            id="filter-brand"
            options={brandOptions}
            value={brandId}
            onChange={onBrandChange}
            format={formatBrand}
            preserveCase
          />

          <Select
            label="Status"
            id="filter-status"
            options={STATUS_FILTERS.map((option) => option.value)}
            value={status}
            onChange={onStatusChange}
            format={formatStatus}
            preserveCase
          />

          <Select
            label="Stock"
            id="filter-stock"
            options={STOCK_FILTERS.map((option) => option.value)}
            value={stock}
            onChange={onStockChange}
            format={formatStock}
            preserveCase
          />

          <Select
            label="Sort by"
            id="filter-sort"
            options={SORT_OPTIONS.map((option) => option.value)}
            value={sort}
            onChange={onSortChange}
            format={formatSort}
            preserveCase
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex justify-end border-t border-c-border pt-3">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2
              text-sm font-semibold text-c-text-secondary transition-colors
              hover:bg-c-bg hover:text-c-danger"
          >
            <LuX size={15} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
