import { type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import FormField from "../../../shared/components/formField/formField";
import Select from "../../../shared/components/select/select";
import ProductImagePicker from "./productImagePicker";

import { getBrands, getCategories } from "../api";
import {
  PRODUCT_STATUSES,
  productSchema,
  type ProductFormData,
} from "./productSchema";

interface ProductFormProps {
  defaultValues: ProductFormData;
  submitLabel: string;
  submitIcon: ReactNode;
  isPending: boolean;
  errorMessage: string | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export default function ProductForm({
  defaultValues,
  submitLabel,
  submitIcon,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onBlur",
    defaultValues,
  });

  const brandId = useWatch({ control, name: "brandId" }) ?? "";

  function formatCategory(value: string) {
    return (
      categories.find((category) => category.id === value)?.name ??
      "Select a category"
    );
  }

  function formatStatus(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return (
    <div
      className="w-full rounded-2xl border border-c-border
        bg-c-surface sm:p-3 max-sm:px-2"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >

        <div className="px-2">
          <Controller
            name="image"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <ProductImagePicker
                  image={field.value ?? ""}
                  onChange={(value) => {
                    field.onChange(value);
                    field.onBlur();
                  }}
                />

                {fieldState.error?.message && (
                  <p className="text-xs text-c-danger">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div
          className="grid grid-cols-2 gap-x-5 gap-y-4
            max-sm:grid-cols-1"
        >
          <div className="col-span-2 max-sm:col-span-1">
            <FormField
              label="Product Name"
              name="name"
              register={register}
              error={errors.name?.message}
            />
          </div>

          <Controller
            name="categoryId"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                label="Category"
                id="categoryId"
                options={categories.map((category) => category.id)}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);

                  const brandStillValid = brands
                    .find((brand) => brand.id === brandId)
                    ?.categoryIds.includes(value);

                  if (!brandStillValid) {
                    setValue("brandId", "");
                    trigger("brandId");
                  }
                }}
                onBlur={field.onBlur}
                format={formatCategory}
                preserveCase
                error={fieldState.error?.message}
              />
            )}
          />

          <FormField
            label="Brand"
            name="brandId"
            type="text"
            register={register}
            error={errors.brandId?.message}
          />

          <FormField
            label="Price (USD)"
            name="price"
            type="number"
            min={0}
            register={register}
            registerOptions={{ valueAsNumber: true }}
            error={errors.price?.message}
          />

          <FormField
            label="Stock Quantity"
            name="stock"
            type="number"
            min={0}
            register={register}
            registerOptions={{ valueAsNumber: true }}
            error={errors.stock?.message}
          />

          <FormField
            label="Discount (%)"
            name="discount"
            type="number"
            min={0}
            max={100}
            register={register}
            registerOptions={{ valueAsNumber: true }}
            error={errors.discount?.message}
          />

          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                label="Status"
                id="status"
                options={PRODUCT_STATUSES}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                format={formatStatus}
                preserveCase
                error={fieldState.error?.message}
              />
            )}
          />

          <div className="col-span-2 max-sm:col-span-1">
            <FormField
              label="Description"
              name="description"
              textarea
              register={register}
              error={errors.description?.message}
            />
          </div>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="text-sm font-medium text-c-danger"
          >
            {errorMessage}
          </p>
        )}

        <div
          className="mt-2 flex justify-end gap-3 border-t
            border-c-border pt-5"
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="btn btn-ghost rounded-lg border-2
              border-c-danger font-bold text-c-danger
              hover:bg-c-danger hover:text-white
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary rounded-lg border-none
              px-6 text-white disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              submitIcon
            )}

            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}