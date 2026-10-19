import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuArrowLeft, LuPencil } from "react-icons/lu";

import ProductForm from "./components/productForm";
import {
  getProductById,
  updateProduct,
  type Product,
  type ProductPayload,
} from "./api";
import type { ProductFormData } from "./components/productSchema";

function buildPayload(
  product: Product,
  data: ProductFormData,
): ProductPayload {
  return {
    name: data.name,
    categoryId: data.categoryId,
    brandId: data.brandId,
    price: data.price,
    stock: data.stock,
    discount: data.discount,
    status: data.status,
    image: data.image,
    description: data.description,
    // Preserve performance data that the form doesn't edit.
    soldCount: product.soldCount,
    monthlySales: product.monthlySales,
    totalRevenue: product.totalRevenue,
  };
}

function FormSkeleton() {
  return (
    <div
      className="w-full rounded-2xl border border-c-border bg-c-surface p-5
        sm:p-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="size-30 animate-pulse rounded-2xl bg-c-bg" />

        <div className="flex-1 space-y-2">
          <div className="h-5 w-1/3 animate-pulse rounded bg-c-bg" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-c-bg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={index === 0 || index > 5 ? "col-span-2 max-sm:col-span-1" : ""}
          >
            <div className="mb-2 h-3.5 w-24 animate-pulse rounded bg-c-bg" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-c-bg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: Boolean(id),
    retry: false,
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: ProductFormData) =>
      updateProduct(id as string, buildPayload(product as Product, data)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      navigate(`/products/${id}`);
    },
  });

  if (isLoading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-20 animate-pulse rounded-4xl bg-c-bg" />
          <div className="h-7 w-44 animate-pulse rounded bg-c-bg" />
        </div>

        <FormSkeleton />
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="inline-flex shrink-0 cursor-pointer items-center
              justify-center gap-1.5 rounded-4xl border border-c-border
              bg-c-surface px-3 py-2 text-c-text-secondary transition
              hover:bg-c-surface-hover hover:text-c-text
              active:bg-c-surface-active"
          >
            <LuArrowLeft size={16} />
            <span>Back</span>
          </Link>

          <h2 className="text-2xl font-semibold text-c-text-secondary">
            Edit Product
          </h2>
        </div>

        <div className="flex min-h-60 flex-col items-center justify-center gap-4
          rounded-2xl border border-c-border bg-c-surface text-center">
          <p className="text-sm font-medium text-c-danger">
            Failed to load product.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="inline-flex items-center justify-center gap-2 rounded-xl
              border border-c-border bg-c-surface px-4 py-2.5 text-sm
              font-semibold text-c-text-secondary transition
              hover:bg-c-surface-hover hover:text-c-text"
          >
            Back to products
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/products/${product.id}`}
          className="inline-flex shrink-0 cursor-pointer items-center
            justify-center gap-1.5 rounded-4xl border border-c-border
            bg-c-surface px-3 py-2 text-c-text-secondary transition
            hover:bg-c-surface-hover hover:text-c-text
            active:bg-c-surface-active"
        >
          <LuArrowLeft size={16} />
          <span>Back</span>
        </Link>

        <h2 className="truncate text-2xl font-semibold text-c-text-secondary">
          Edit {product.name}
        </h2>
      </div>

      <ProductForm
        defaultValues={{
          name: product.name,
          categoryId: product.categoryId,
          brandId: product.brandId,
          price: product.price,
          stock: product.stock,
          discount: product.discount,
          status: product.status,
          image: product.image,
          description: product.description,
        }}
        submitLabel="Save Changes"
        submitIcon={<LuPencil size={17} />}
        isPending={isPending}
        errorMessage={
          error instanceof Error
            ? error.message
            : null
        }
        onSubmit={(data) => mutate(data)}
        onCancel={() => navigate(`/products/${product.id}`)}
      />
    </section>
  );
}
