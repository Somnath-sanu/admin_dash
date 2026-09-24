import { apiClient } from "@/lib/api/client";

export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
};

export type ProductPage = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type GetProductsOptions = {
  limit: number;
  skip: number;
  signal?: AbortSignal;
};

export async function getProducts({ limit, skip, signal }: GetProductsOptions) {
  const { data } = await apiClient.get<ProductPage>("/products", {
    params: { limit, skip },
    signal,
  });

  return data;
}
