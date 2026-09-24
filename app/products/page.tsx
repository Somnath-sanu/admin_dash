import { LogoutButton } from "@/components/auth/logout-button";
import { ProductCatalog } from "@/components/products/product-catalog";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Products</h1>
          </div>
          <LogoutButton />
        </header>
        <div className="mt-8">
          <Suspense fallback={<section className="grid min-h-72 place-items-center rounded-lg border border-zinc-200 bg-white text-sm text-zinc-600">Loading products…</section>}>
            <ProductCatalog />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
