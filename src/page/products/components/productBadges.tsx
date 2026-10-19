import type { Product } from "../api";
import { formatExactPrice, type StockState } from "../utils";


interface StockIndicatorProps {
  stock: number;
  state: StockState;
}

const STOCK_STYLES: Record<StockState, string> = {
  in: "text-c-text-primary",
  low: "text-c-warning",
  out: "text-c-danger",
};

const STOCK_LABELS: Record<StockState, string> = {
  in: "In stock",
  low: "Low stock",
  out: "Out of stock",
};

export function StockIndicator({ stock, state }: StockIndicatorProps) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className={`whitespace-nowrap text-sm font-semibold ${STOCK_STYLES[state]}`}>
        {stock} {stock === 1 ? "unit" : "units"}
      </span>

      <span className="text-[11px] font-medium uppercase tracking-wide text-c-text-muted">
        {STOCK_LABELS[state]}
      </span>
    </div>
  );
}

interface PriceDisplayProps {
  product: Product;
}

export function PriceDisplay({ product }: PriceDisplayProps) {
  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className="whitespace-nowrap text-sm font-semibold text-c-text-primary w-full text-end">
        {formatExactPrice(finalPrice)}
      </div>

      {hasDiscount && (
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-c-danger/10 px-1.5 py-0.5 text-[10px] font-bold text-c-danger">
            -{product.discount}%
          </span>
          <span className="text-xs text-c-text-muted line-through">
            {formatExactPrice(product.price)}
          </span>
        </div>
      )}
    </div>
  );
}
