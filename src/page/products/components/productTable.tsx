import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  columnVisibilityFeature,
  createColumnHelper,
  flexRender,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu"; import type { Brand, Category, Product } from "../api";
import {
  formatNumber,
  getBrandName,
  getCategoryName,
  getStockState,
} from "../utils";
import ProductImage from "./productImage";
import { PriceDisplay, StockIndicator } from "./productBadges";
import StatusBadge from "../../../shared/components/statusBadge/statusBadge";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  onDeleteRequest: (product: Product) => void;
}

const features = tableFeatures({
  rowPaginationFeature,
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof features, Product>();

function ProductCell({
  product,
  brandName,
}: {
  product: Product;
  brandName: string;
}) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex min-w-60 items-center gap-3"
    >
      <ProductImage
        src={product.image}
        name={product.name}
        size="sm"
      />

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-c-text-primary
          transition-colors group-hover:text-c-primary">
          {product.name}
        </p>

        <p className="truncate text-xs text-c-text-muted">{brandName}</p>
      </div>
    </Link>
  );
}

function ActionsCell({
  product,
  onDeleteRequest,
}: {
  product: Product;
  onDeleteRequest: (product: Product) => void;
}) {
  return (
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
  );
}

export default function ProductTable({
  products,
  categories,
  brands,
  onDeleteRequest,
}: ProductTableProps) {
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("name", {
          header: "Product",
          cell: (info) => (
            <ProductCell
              product={info.row.original}
              brandName={getBrandName(info.row.original.brandId, brands)}
            />
          ),
        }),

        columnHelper.accessor("categoryId", {
          header: "Category",
          cell: (info) => (
            <span className="whitespace-nowrap text-sm text-c-text-primary">
              {getCategoryName(info.getValue(), categories)}
            </span>
          ),
        }),

        columnHelper.accessor("price", {
          header: "Price",
          cell: (info) => 
          <span className="flex items-center justify-center">
            <PriceDisplay product={info.row.original} />
          </span>,
        }),

        columnHelper.accessor("stock", {
          header: "Stock",
          cell: (info) => (
            <StockIndicator
              stock={info.getValue()}
              state={getStockState(info.getValue())}
            />
          ),
        }),

        columnHelper.accessor("soldCount", {
          header: "Sold",
          cell: (info) => (
            <span className="flex items-center justify-center whitespace-nowrap text-sm text-c-text-primary">
              {formatNumber(info.getValue())}
            </span>
          ),
        }),

        columnHelper.accessor("status", {
          header: "Status",
          cell: (info) => (
            <div className="flex justify-center items-center">
              <StatusBadge status={info.getValue()} />
            </div>
          ),
        }),

        columnHelper.display({
          id: "actions",
          header: () => <span className="sr-only">Actions</span>,
          cell: (info) => (
            <ActionsCell
              product={info.row.original}
              onDeleteRequest={onDeleteRequest}
            />
          ),
        }),
      ]),
    [categories, brands, onDeleteRequest],
  );

  const table = useTable({
    key: "products-table",
    features,
    columns,
    data: products,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-225">
        <thead >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-c-border bg-c-surface"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`whitespace-nowrap px-5 py-3.5 text-xs
                    font-semibold uppercase tracking-wide text-c-text-muted
                    ${header.column.id === "actions"
                      ? "text-right"
                      : header.column.id === "name"
                        ? "text-left"
                        : "text-center"
                    }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-c-border transition-colors last:border-b-0 hover:bg-c-surface-hover/50"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-5 py-3.5"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
