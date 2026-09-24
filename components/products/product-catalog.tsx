"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  getCategories,
  getProducts,
  type Category,
  type ProductPage,
} from "@/lib/api/products";
import { PaginationControls } from "@/components/products/pagination-controls";
import { ProductCards } from "@/components/products/product-cards";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductTable } from "@/components/products/product-table";

const PAGE_SIZES = [10, 20, 50];
const SORT_FIELDS = ["title", "price", "rating"] as const;

type Result = { key: string; data: ProductPage };
type RequestError = { key: string; message: string };

export function ProductCatalog() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPage = Number(searchParams.get("page"));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = PAGE_SIZES.includes(Number(searchParams.get("limit")))
    ? Number(searchParams.get("limit"))
    : 10;
  const query = searchParams.get("q")?.trim() || "";
  const category = query ? "" : searchParams.get("category") || "";
  const sortBy = SORT_FIELDS.includes(
    searchParams.get("sortBy") as (typeof SORT_FIELDS)[number],
  )
    ? (searchParams.get("sortBy") as (typeof SORT_FIELDS)[number])
    : undefined;
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";
  const [search, setSearch] = useState(query);
  const [categories, setCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [requestError, setRequestError] = useState<RequestError | null>(null);
  const [retry, setRetry] = useState(0);

  const updateUrl = useCallback(
    (changes: Record<string, string | null>, replace = false) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(changes).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      const url = `${pathname}?${params.toString()}`;
      if (replace) router.replace(url);
      else router.push(url);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextQuery = search.trim();
      if (nextQuery !== query) {
        updateUrl({ q: nextQuery || null, category: null, page: "1" });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [query, search, updateUrl]);

  const key = `${page}|${pageSize}|${query}|${category}|${sortBy || ""}|${order}|${retry}`;

  useEffect(() => {
    const controller = new AbortController();

    getProducts({
      limit: pageSize,
      skip: (page - 1) * pageSize,
      query,
      category,
      sortBy,
      order,
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        setResult({ key, data });
        setRequestError(null);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRequestError({ key, message: "Unable to load products." });
        }
      });

    return () => controller.abort();
  }, [category, key, order, page, pageSize, query, sortBy]);

  const data = result?.data;
  const loading = result?.key !== key && requestError?.key !== key;
  const error = requestError?.key === key ? requestError.message : "";
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  // useEffect(() => {
  //   if (data && page > totalPages) {
  //     updateUrl({ page: String(totalPages) }, true);
  //   }
  // }, [data, page, totalPages, updateUrl]);

  function changePage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      updateUrl({ page: String(newPage) });
    }
  }

  function changePageSize(newSize: number) {
    updateUrl({ page: "1", limit: String(newSize) });
  }

  function changeCategory(nextCategory: string) {
    setSearch("");
    updateUrl({ q: null, category: nextCategory || null, page: "1" });
  }

  function changeSort(nextSortBy: string) {
    updateUrl({
      sortBy: nextSortBy || null,
      order: "asc",
      page: "1",
    });
  }

  if (loading && !data) {
    return <section className="p-6 text-center">Loading products...</section>;
  }

  if (error) {
    return (
      <section className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm text-white"
          onClick={() => setRetry((value) => value + 1)}
          type="button"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!data) return null;

  const start = data.total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, data.total);

  return (
    <section className="space-y-4">
      <ProductFilters
        categories={categories}
        category={category}
        onCategoryChange={changeCategory}
        onOrderChange={(nextOrder) =>
          updateUrl({ order: nextOrder, page: "1" })
        }
        onSearchChange={setSearch}
        onSortChange={changeSort}
        order={order}
        search={search}
        sortBy={sortBy || ""}
      />

      {loading ? (
        <p className="text-sm text-zinc-500">Loading products...</p>
      ) : null}

      {data.products.length === 0 ? (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600">
          No products found.
        </section>
      ) : (
        <>
          <ProductTable products={data.products} />
          <ProductCards products={data.products} />
        </>
      )}

      <PaginationControls
        currentPage={page}
        end={end}
        onPageChange={changePage}
        onPageSizeChange={changePageSize}
        pageSize={pageSize}
        pageSizes={PAGE_SIZES}
        start={start}
        total={data.total}
        totalPages={totalPages}
      />
    </section>
  );
}
