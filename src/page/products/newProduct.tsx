import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuArrowLeft, LuPlus } from "react-icons/lu";

import ProductForm from "./components/productForm";
import { createProduct, type ProductPayload } from "./api";
import type { ProductFormData } from "./components/productSchema";

const EMPTY_FORM: ProductFormData = {
  name: "",
  categoryId: "",
  brandId: "",
  price: 0,
  stock: 0,
  discount: 0,
  status: "active",
  image: "",
  description: "",
};

function buildPayload(data: ProductFormData): ProductPayload {
  return {
    ...data,
    soldCount: 0,
    monthlySales: [],
    totalRevenue: 0,
  };
}

export default function NewProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: ProductFormData) => createProduct(buildPayload(data)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

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
          Add New Product
        </h2>
      </div>

      <ProductForm
        defaultValues={EMPTY_FORM}
        submitLabel="Create Product"
        submitIcon={<LuPlus size={18} />}
        isPending={isPending}
        errorMessage={
          error instanceof Error
            ? error.message
            : null
        }
        onSubmit={(data) => mutate(data)}
        onCancel={() => navigate("/products")}
      />
    </section>
  );
}
