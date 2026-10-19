import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { LuDownload, LuPlus } from "react-icons/lu";

import useDebounce from "../../shared/hooks/useDebounce";
import {
  deleteProduct,
  getBrands,
  getCategories,
  getProducts,
  type Product,
} from "./api";
import {
  exportProductsToCsv,
  getBrandName,
  getStockState,
  SORT_OPTIONS,
  type SortOption,
  type StockFilter,
} from "./utils";
import type { StatusFilter } from "./components/productsToolbar";
import ProductStatCards from "./components/productStatCards";
import ProductsToolbar from "./components/productsToolbar";
import ProductTable from "./components/productTable";
import ProductCard from "./components/productCard";
import Pagination from "../../shared/components/pagination/pagination";
import ProductsSkeleton from "./components/productsSkeleton";
import ProductsEmptyState from "./components/productsEmptyState";
import DeleteProductDialog from "./components/deleteProductDialog";

const DEFAULT_SORT: SortOption = "sold-desc";

const STATUS_VALUES: StatusFilter[] = ["all", "active", "draft", "archived"];
const STOCK_VALUES: StockFilter[] = ["all", "in", "low", "out"];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const PRODUCT_SORTERS: Record<string, (a: Product, b: Product) => number> = {
  sold: (a, b) => a.soldCount - b.soldCount,
  price: (a, b) => a.price - b.price,
  stock: (a, b) => a.stock - b.stock,
};

export default function Products() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    placeholderData: keepPreviousData,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("size"));

  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const pageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize)
    ? rawPageSize
    : 10;

  const urlSearch = searchParams.get("q") ?? "";
  const categoryId = searchParams.get("category") ?? "all";
  const brandId = searchParams.get("brand") ?? "all";
  const statusParam = searchParams.get("status");
  const status: StatusFilter = STATUS_VALUES.includes(
    statusParam as StatusFilter,
  )
    ? (statusParam as StatusFilter)
    : "all";
  const stockParam = searchParams.get("stock");
  const stock: StockFilter = STOCK_VALUES.includes(stockParam as StockFilter)
    ? (stockParam as StockFilter)
    : "all";
  const sortParam = searchParams.get("sort");
  const sort: SortOption = SORT_OPTIONS.some((option) => option.value === sortParam)
    ? (sortParam as SortOption)
    : DEFAULT_SORT;

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (debouncedSearch) {
        next.set("q", debouncedSearch);
      } else {
        next.delete("q");
      }

      next.set("page", "1");
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, setSearchParams]);

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

  const hasActiveFilters =
    debouncedSearch.trim() !== "" ||
    categoryId !== "all" ||
    brandId !== "all" ||
    status !== "all" ||
    stock !== "all";

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const query = debouncedSearch.trim().toLowerCase();

    const matchingBrandIds = query
      ? new Set(
        brands
          .filter((brand) => brand.name.toLowerCase().includes(query))
          .map((brand) => brand.id),
      )
      : null;

    const result = products.filter((product) => {
      if (query) {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = matchingBrandIds?.has(product.brandId) ?? false;

        if (!matchesName && !matchesBrand) return false;
      }

      if (categoryId !== "all" && product.categoryId !== categoryId) {
        return false;
      }

      if (brandId !== "all" && product.brandId !== brandId) {
        return false;
      }

      if (status !== "all" && product.status !== status) return false;

      if (stock !== "all" && getStockState(product.stock) !== stock) {
        return false;
      }

      return true;
    });

    const [field, direction] = sort.split("-") as [
      keyof typeof PRODUCT_SORTERS,
      "asc" | "desc",
    ];

    result.sort((a, b) => {
      const comparison = PRODUCT_SORTERS[field](a, b);
      const adjusted = direction === "asc" ? comparison : -comparison;

      return adjusted === 0 ? a.name.localeCompare(b.name) : adjusted;
    });

    return result;
  }, [products, brands, debouncedSearch, categoryId, brandId, status, stock, sort]);

  const total = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [filteredProducts, currentPage, pageSize],
  );

  useEffect(() => {
    if (total === 0 || page <= pageCount) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(pageCount));
      return next;
    });
  }, [total, page, pageCount, setSearchParams]);

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProductToDelete(null);
    },
  });

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

  function handleCategoryChange(value: string) {
    const selectedBrand = brands.find((brand) => brand.id === brandId);
    const brandStillValid =
      value === "all" ||
      selectedBrand?.categoryIds.includes(value) ||
      selectedBrand === undefined;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value === "all") {
        next.delete("category");
      } else {
        next.set("category", value);
      }

      if (!brandStillValid) {
        next.delete("brand");
      }

      next.set("page", "1");
      return next;
    });
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("q");
      next.delete("category");
      next.delete("brand");
      next.delete("status");
      next.delete("stock");
      next.set("sort", DEFAULT_SORT);
      next.set("page", "1");
      return next;
    });
  }

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

  function handleExport() {
    if (!products) return;
    exportProductsToCsv(filteredProducts, categories, brands);
  }

  const showSkeleton = isLoading;
  const showError = isError;
  const showEmpty = !showSkeleton && !showError && total === 0;
  const emptyVariant: "empty-inventory" | "no-results" =
    products !== undefined && products.length === 0
      ? "empty-inventory"
      : "no-results";

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-c-text-secondary">
            Products
          </h2>

          <p className="mt-1 text-sm text-c-text-muted">
            Manage your products, inventory, and performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            disabled={!products || products.length === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl
              border border-c-border bg-c-surface px-4 text-sm font-semibold
              text-c-text-secondary transition-colors
              hover:border-c-border-strong hover:bg-c-surface-hover hover:text-c-text
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-primary/40
              focus-visible:ring-offset-1 focus-visible:ring-offset-c-bg
              disabled:cursor-not-allowed disabled:opacity-50 "
          >
            <LuDownload size={18} />
            Export
          </button>

          <Link
            to="/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl
              bg-c-primary px-4 text-sm font-semibold text-white
              transition-colors hover:bg-blue-700
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-primary/50
              focus-visible:ring-offset-1 focus-visible:ring-offset-c-bg
              active:translate-y-px"
          >
            <LuPlus size={18} color="white" />
            <span className="text-white">Add Product</span>
          </Link>
        </div>
      </div>

      <ProductStatCards
        products={products}
        isLoading={isLoading}
      />

      <ProductsToolbar
        categories={categories}
        brands={brands}
        search={searchInput}
        onSearchChange={setSearchInput}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        brandId={brandId}
        onBrandChange={(value) => setParam("brand", value === "all" ? "" : value)}
        status={status}
        onStatusChange={(value) =>
          setParam("status", value === "all" ? "" : value)
        }
        stock={stock}
        onStockChange={(value) =>
          setParam("stock", value === "all" ? "" : value)
        }
        sort={sort}
        onSortChange={(value) => setParam("sort", value)}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {showSkeleton ? (
        <ProductsSkeleton />
      ) : showError ? (
        <div className="flex min-h-60 flex-col items-center justify-center gap-4
          rounded-2xl border border-c-border bg-c-surface text-center">
          <p className="text-sm font-medium text-c-danger">
            Failed to load products.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 rounded-xl
              border border-c-border bg-c-surface px-4 py-2.5 text-sm
              font-semibold text-c-text-secondary transition
              hover:bg-c-surface-hover hover:text-c-text"
          >
            Try again
          </button>
        </div>
      ) : showEmpty ? (
        <div className="rounded-2xl border border-c-border bg-c-surface">
          <ProductsEmptyState
            variant={emptyVariant}
            onClearFilters={handleClearFilters}
          />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-c-border bg-c-surface">
          <div className="block max-[1000px]:hidden">
            <ProductTable
              products={pagedProducts}
              categories={categories}
              brands={brands}
              onDeleteRequest={setProductToDelete}
            />
          </div>

          <div className="hidden max-[1000px]:block">
            {pagedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                brands={brands}
                onDeleteRequest={setProductToDelete}
              />
            ))}
          </div>

          <Pagination
            page={currentPage}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

      <DeleteProductDialog
        product={productToDelete}
        brandName={
          productToDelete ? getBrandName(productToDelete.brandId, brands) : ""
        }
        isPending={deleteMutation.isPending}
        error={
          deleteMutation.isError
            ? deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : "Failed to delete product. Please try again."
            : null
        }
        onConfirm={() => {
          if (!productToDelete || deleteMutation.isPending) return;
          deleteMutation.mutate(productToDelete.id);
        }}
        onCancel={() => {
          deleteMutation.reset();
          setProductToDelete(null);
        }}
      />
    </section>
  );
}