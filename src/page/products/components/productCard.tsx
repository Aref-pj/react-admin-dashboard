import { Link } from "react-router-dom";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";

import type { Brand, Category, Product } from "../api";
import {
  formatNumber,
  getBrandName,
  getCategoryName,
  getStockState,
} from "../utils";
import ProductImage from "./productImage";
import { PriceDisplay, StockIndicator } from "./productBadges";
import StatusBadge from "../../../shared/components/statusBadge/statusBadge";

interface ProductCardProps {
  product: Product;
  categories: Category[];
  brands: Brand[];
  onDeleteRequest: (product: Product) => void;
}

export default function ProductCard({
  product,
  categories,
  brands,
  onDeleteRequest,
}: ProductCardProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-c-border p-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Link
          to={`/products/${product.id}`}
          className="group shrink-0"
          aria-label={`View ${product.name}`}
        >
          <ProductImage
            src={product.image}
            name={product.name}
            size="md"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            to={`/products/${product.id}`}
            className="group"
          >
            <p className="truncate text-sm font-medium text-c-text-primary
              transition-colors group-hover:text-c-primary">
              {product.name}
            </p>
          </Link>

          <p className="truncate text-xs text-c-text-muted">
            {getBrandName(product.brandId, brands)}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={product.status} />

            <span className="truncate text-xs text-c-text-muted">
              {getCategoryName(product.categoryId, categories)}
            </span>
          </div>
        </div>

        <PriceDisplay product={product} />
      </div>

      <div className="flex items-end justify-between gap-3 pl-1">
        <div className="flex items-center gap-5">
          <StockIndicator
            stock={product.stock}
            state={getStockState(product.stock)}
          />

          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-c-text-primary">
              {formatNumber(product.soldCount)}
            </span>

            <span className="text-[11px] font-medium uppercase tracking-wide text-c-text-muted">
              Sold
            </span>
          </div>
        </div>

    <div className="flex items-center justify-end gap-1">
      <Link
        to={`/products/${product.id}`}
        aria-label={`View ${product.name}`}
        title="View details"
        className="flex size-8 items-center justify-center rounded-lg
           transition-colors hover:bg-c-info/10 group"
      >
        <span className="text-c-text-secondary group-hover:text-c-info"><LuEye size={17} /></span>
      </Link>

      <Link
        to={`/products/${product.id}/edit`}
        aria-label={`Edit ${product.name}`}
        title="Edit"
        className="flex size-8 items-center justify-center rounded-lg
           transition-colors hover:bg-c-warning/10 group"
      >
        <span className="text-c-text-secondary group-hover:text-c-warning"><LuPencil size={16} /></span>
      </Link>

      <button
        type="button"
        onClick={() => onDeleteRequest(product)}
        aria-label={`Delete ${product.name}`}
        title="Delete"
        className="flex size-8 items-center justify-center rounded-lg
          text-c-text-secondary transition-colors hover:bg-c-danger/10 hover:text-c-danger"
      >
        <LuTrash2 size={16} />
      </button>
    </div>
      </div>
    </div>
  );
}
