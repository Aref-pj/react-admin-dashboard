import { z } from "zod";

export const PRODUCT_STATUSES = ["active", "draft", "archived"] as const;

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),

  categoryId: z.string().min(1, "Select a category"),

  brandId: z.string().min(1, "Enter a brand"),

  price: z
    .number({ message: "Enter a price" })
    .min(1, "Price must be greater than 0")
    .max(1_000_000, "Price is too high"),

  stock: z
    .number({ message: "Enter a stock quantity" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(1_000_000, "Stock is too high"),

  discount: z
    .number({ message: "Enter a discount" })
    .int("Discount must be a whole number")
    .min(0, "Discount cannot be negative")
    .max(99, "Discount must be less than 100"),

  status: z.enum(PRODUCT_STATUSES),

  image: z
    .string(),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

export type ProductFormData = z.infer<typeof productSchema>;
