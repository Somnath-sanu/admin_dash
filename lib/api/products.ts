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

export type ProductDetail = Product & {
  description: string;
  images: string[];
  reviews: {
    rating: number;
    comment: string;
    reviewerName: string;
  }[];
};

export type GetProductsOptions = {
  limit: number;
  skip: number;
  query?: string;
  category?: string;
  sortBy?: "title" | "price" | "rating";
  order?: "asc" | "desc";
  signal?: AbortSignal;
};

export type Category = {
  slug: string;
  name: string;
};

export async function getProducts({
  limit,
  skip,
  query,
  category,
  sortBy,
  order,
  signal,
}: GetProductsOptions) {
  const endpoint = query
    ? "/products/search"
    : category
      ? `/products/category/${category}`
      : "/products";

  const { data } = await apiClient.get<ProductPage>(endpoint, {
    params: { limit, skip, q: query || undefined, sortBy, order },
    signal,
  });

  return data;
}

export async function getCategories() {
  const { data } = await apiClient.get<Array<Category | string>>(
    "/products/categories",
  );

  return data.map((category) =>
    typeof category === "string"
      ? { slug: category, name: category }
      : category,
  );
}

export async function getProduct(id: number, signal?: AbortSignal) {
  const { data } = await apiClient.get<ProductDetail>(`/products/${id}`, {
    signal,
  });

  return data;
}
