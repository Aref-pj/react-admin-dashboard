import type { Brand, Category, Product } from "./api";

export const LOW_STOCK_THRESHOLD = 10;

export type StockState = "in" | "low" | "out";

export type StockFilter = "all" | StockState;

export const STOCK_FILTERS: { value: StockFilter; label: string }[] = [
  { value: "all", label: "All Stock" },
  { value: "in", label: "In Stock" },
  { value: "low", label: "Low Stock" },
  { value: "out", label: "Out of Stock" },
];

export type SortOption =
  | "sold-desc"
  | "price-desc"
  | "price-asc"
  | "stock-desc"
  | "stock-asc";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "sold-desc", label: "Best Selling" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "stock-desc", label: "Stock: High to Low" },
  { value: "stock-asc", label: "Stock: Low to High" },
];

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const exactPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatExactPrice(value: number): string {
  return exactPriceFormatter.format(value);
}

export function formatCompactPrice(value: number): string {
  return compactPriceFormatter.format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getStockState(stock: number): StockState {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function getCategoryName(
  categoryId: string | undefined,
  categories: Category[],
): string {
  return categories.find((category) => category.id === categoryId)?.name ?? "—";
}

export function getBrandName(
  brandId: string | undefined,
  brands: Brand[],
): string {
  return brands.find((brand) => brand.id === brandId)?.name ?? "—";
}

export function calculateInventoryValue(products: Product[]): number {
  return products.reduce((total, product) => total + product.price * product.stock, 0);
}

export function countLowStock(products: Product[]): number {
  return products.filter(
    (product) =>
      product.status === "active" &&
      getStockState(product.stock) === "low",
  ).length;
}

export function exportProductsToCsv(
  products: Product[],
  categories: Category[],
  brands: Brand[],
): void {
  const headers = [
    "Name",
    "Brand",
    "Category",
    "Price (USD)",
    "Stock",
    "Sold",
    "Status",
  ];

  const rows = products.map((product) => [
    product.name,
    getBrandName(product.brandId, brands),
    getCategoryName(product.categoryId, categories),
    String(product.price),
    String(product.stock),
    String(product.soldCount),
    product.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replaceAll('"', '""');
          return `"${escaped}"`;
        })
        .join(","),
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
