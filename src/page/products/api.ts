import api from "../../app/api/axios";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  categoryIds: string[];
}

export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  brandId: string;
  price: number;
  stock: number;
  soldCount: number;
  monthlySales: number[];
  totalRevenue: number;
  discount: number;
  image: string;
  status: ProductStatus;
  description: string;
}

export type ProductPayload = Omit<Product, "id">;

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products");
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export async function getBrands(): Promise<Brand[]> {
  const response = await api.get<Brand[]>("/brands");
  return response.data;
}

export async function createProduct(
  payload: ProductPayload,
): Promise<Product> {
  const response = await api.post<Product>("/products", payload);
  return response.data;
}

export async function updateProduct(
  id: string,
  payload: ProductPayload,
): Promise<Product> {
  const response = await api.put<Product>(`/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
