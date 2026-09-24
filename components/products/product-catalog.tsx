"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getProducts, type ProductPage } from "@/lib/api/products";
import { PaginationControls } from "@/components/products/pagination-controls";
import { ProductCards } from "@/components/products/product-cards";
import { ProductTable } from "@/components/products/product-table";

const PAGE_SIZES = [10, 20, 50];

export function ProductCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const urlLimit = Number(searchParams.get("limit"));
  let invalidLimit = false;

  if (!PAGE_SIZES.includes(urlLimit)) {
    invalidLimit = true;
    router.push(`?page=${page}&limit=10`);
  }

  const pageSize = invalidLimit ? 10 : urlLimit;

  const [data, setData] = useState<ProductPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const result = await getProducts({
          limit: pageSize,
          skip: (page - 1) * pageSize,
        });

        setData(result);
      } catch (error) {
        console.log(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [page, pageSize]);

  function changePage(newPage: number) {
    if (newPage < 1) return;

    router.push(`?page=${newPage}&limit=${pageSize}`);
  }

  function changePageSize(newSize: number) {
    if (!PAGE_SIZES.includes(newSize)) {
      return;
    }
    router.push(`?page=1&limit=${newSize}`);
  }

  if (loading) {
    return <section className="p-6 text-center">Loading products...</section>;
  }

  if (error) {
    return <section className="p-6 text-center text-red-600">{error}</section>;
  }

  if (!data) {
    return null;
  }

  const totalPages = Math.ceil(data.total / pageSize);

  if (page > totalPages && totalPages > 0) {
    router.replace(`?page=${totalPages}&limit=${pageSize}`);
    return null;
  }

  const start = data.total === 0 ? 0 : (page - 1) * pageSize + 1;

  const end = Math.min(page * pageSize, data.total);

  return (
    <section className="space-y-4">
      <ProductTable products={data.products} />

      <ProductCards products={data.products} />

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizes={PAGE_SIZES}
        start={start}
        end={end}
        total={data.total}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
      />
    </section>
  );
}
