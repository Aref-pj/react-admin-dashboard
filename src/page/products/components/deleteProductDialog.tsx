import { useEffect } from "react";
import { LuTrash2 } from "react-icons/lu";

import type { Product } from "../api";

interface DeleteProductDialogProps {
  product: Product | null;
  brandName: string;
  isPending: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteProductDialog({
  product,
  brandName,
  isPending,
  error,
  onConfirm,
  onCancel,
}: DeleteProductDialogProps) {
  const isOpen = product !== null;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onCancel]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
        backdrop-blur-sm"
      onClick={() => {
        if (!isPending) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-c-border bg-c-surface p-6
          shadow-xl max-sm:rounded-none max-sm:border-none max-sm:bg-c-background
          max-sm:h-full max-sm:max-h-none max-sm:flex max-sm:flex-col
          max-sm:justify-center"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl
            bg-c-danger/10 text-c-danger">
            <LuTrash2 size={20} />
          </div>

          <div className="min-w-0">
            <h3
              id="delete-product-title"
              className="text-lg font-semibold text-c-text"
            >
              Delete product
            </h3>

            <p
              id="delete-product-description"
              className="mt-1.5 text-sm text-c-text-muted"
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold text-c-text-primary">
                {product.name}
              </span>{" "}
              by {brandName}? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {error && (
            <p
              role="alert"
              className="mr-auto max-sm:basis-full text-sm font-medium text-c-danger"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg border border-c-border bg-c-surface px-4 py-2.5
              text-sm font-semibold text-c-text-secondary transition-colors
              hover:bg-c-surface-hover hover:text-c-text
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg
              bg-c-danger px-5 py-2.5 text-sm font-semibold text-white
              transition-colors hover:opacity-90
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <LuTrash2 size={16} />
            )}

            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
