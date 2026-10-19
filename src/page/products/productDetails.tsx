import { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { LuArrowLeft, LuPencil, LuPrinter } from "react-icons/lu";

import MonthlySalesChart from "./components/monthlySalesChart";

import IconButton from "../../shared/components/iconButton/iconButton";
import ProductImage from "./components/productImage";
import { PriceDisplay, StockIndicator } from "./components/productBadges";
import StatusBadge from "../../shared/components/statusBadge/statusBadge";
import {
  getBrands,
  getCategories,
  getProductById,
} from "./api";
import {
  formatExactPrice,
  formatNumber,
  formatPrice,
  getBrandName,
  getCategoryName,
  getStockState,
} from "./utils";

interface InfoItemProps {
  label: string;
  value?: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold text-c-text-muted max-sm:text-base">
        {label}
      </p>

      <p className="text-sm max-sm:text-lg wrap-break-word">{value || "-"}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div
      className="w-full rounded-2xl border border-c-border bg-c-surface p-5
        sm:p-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mb-6 flex items-center gap-5 max-sm:flex-col">
        <div className="size-30 animate-pulse rounded-2xl bg-c-bg" />

        <div className="flex-1 space-y-3">
          <div className="h-6 w-2/5 animate-pulse rounded bg-c-bg" />
          <div className="h-5 w-1/4 animate-pulse rounded bg-c-bg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="mb-2 h-3.5 w-20 animate-pulse rounded bg-c-bg" />
            <div className="h-5 w-28 animate-pulse rounded bg-c-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: Boolean(id),
    retry: false,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const printHandler = useReactToPrint({ contentRef: printRef });

  if (isLoading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-20 animate-pulse rounded-4xl bg-c-bg" />
          <div className="h-7 w-32 animate-pulse rounded bg-c-bg" />
        </div>

        <DetailSkeleton />
      </section>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="flex w-full max-w-lg flex-col items-center justify-center gap-4
            rounded-2xl border border-c-border bg-c-surface px-6 py-12 text-center
            max-sm:h-full max-sm:max-w-none max-sm:rounded-none max-sm:border-none
            max-sm:bg-c-background"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-c-text-secondary">
              Product Not Found
            </h2>

            <p className="text-sm text-c-text-muted">
              The product you are looking for doesn&apos;t exist or has been removed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="btn btn-primary rounded-lg border-none px-6 text-white"
          >
            <LuArrowLeft size={18} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const stockState = getStockState(product.stock);
  const hasDiscount = product.discount > 0;
  const inventoryValue = product.price * product.stock;

  return (
    <div
      ref={printRef}
      className="print-box bg-c-surface max-sm:bg-c-background w-full
        border border-c-border rounded-2xl max-sm:rounded-none max-sm:border-none
        flex flex-col gap-4 p-3 max-sm:p-2"
    >
      <div className="mb-1 flex max-sm:flex-col max-sm:items-start items-center justify-between gap-4 max-sm:px-1">
        <div className="flex min-w-0 items-center gap-3 px-2 pt-2">
          <Link
            to="/products"
            className="no-print inline-flex shrink-0 cursor-pointer items-center
              justify-center gap-1.5 rounded-4xl border border-c-border
              bg-c-surface px-3 py-2 text-c-text-secondary transition
              hover:bg-c-surface-hover hover:text-c-text
              active:bg-c-surface-active"
          >
            <LuArrowLeft size={16} />
            <span>Back</span>
          </Link>

          <h2 className="truncate text-2xl font-semibold text-c-text-secondary">
            Product Details
          </h2>
        </div>

        <div className="no-print flex items-center gap-2">
          <IconButton
            onclick={printHandler}
            className="size-10 bg-c-surface"
          >
            <LuPrinter size={18} />
          </IconButton>

          <Link
            to={`/products/${product.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-xl
              bg-c-primary px-4 py-2.5 text-sm font-semibold text-white
              transition hover:opacity-90"
          >
            <LuPencil size={16} color="white"/>
            <span className="max-sm:hidden text-white">Edit Product</span>
            <span className="hidden max-sm:inline text-white">Edit</span>
          </Link>
        </div>
      </div>

      <div
        className="flex w-full items-center justify-between gap-6 rounded-2xl
          border border-c-border bg-c-surface px-5 py-4
          max-sm:flex-col max-sm:items-start max-sm:px-6 max-sm:py-5"
      >
        <div className="flex min-w-0 items-center gap-5 max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:text-center">
          <ProductImage
            src={product.image}
            name={product.name}
            size="lg"
          />

          <div className="min-w-0">
            <p className="truncate text-xl font-bold max-sm:text-2xl">
              {product.name}
            </p>

            <p className="mt-1 truncate text-sm text-c-text-muted">
              {getBrandName(product.brandId, brands)}
            </p>

            <div className="mt-2 flex items-center gap-2 max-sm:justify-center">
              <StatusBadge status={product.status} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-between gap-2 max-sm:w-full max-sm:flex-row max-sm:items-center 
          max-sm:justify-between h-full">
          <PriceDisplay product={product} />

          <StockIndicator
            stock={product.stock}
            state={stockState}
          />
        </div>
      </div>

      <div className="w-full rounded-2xl border border-c-border bg-c-surface px-6 py-5 max-sm:px-4">
        <h3 className="mb-6 text-lg font-semibold text-c-text-secondary">
          Overview
        </h3>

        <div className="grid grid-cols-2 gap-x-6 gap-y-6 px-3 max-sm:grid-cols-1">
          <InfoItem
            label="Category"
            value={getCategoryName(product.categoryId, categories)}
          />

          <InfoItem
            label="Brand"
            value={getBrandName(product.brandId, brands)}
          />

          <InfoItem
            label="Discount"
            value={hasDiscount ? `${product.discount}%` : "No discount"}
          />

          <InfoItem
            label="Final Price"
            value={
              hasDiscount
                ? formatExactPrice(product.price * (1 - product.discount / 100))
                : formatPrice(product.price)
            }
          />

          <InfoItem
            label="Units Sold"
            value={formatNumber(product.soldCount)}
          />

          <InfoItem
            label="Total Revenue"
            value={formatPrice(product.totalRevenue)}
          />

          <InfoItem
            label="Inventory Value"
            value={formatPrice(inventoryValue)}
          />

          <InfoItem
            label="Status"
            value={product.status}
          />
        </div>
      </div>

      <div className="w-full rounded-2xl border border-c-border bg-c-surface px-6 py-5 max-sm:px-4">
        <h3 className="mb-6 text-lg font-semibold text-c-text-secondary">
          Description
        </h3>

        <p className="px-3 text-sm leading-relaxed text-c-text-secondary">
          {product.description}
        </p>
      </div>

      <MonthlySalesChart monthlySales={product.monthlySales} />
    </div>
  );
}
