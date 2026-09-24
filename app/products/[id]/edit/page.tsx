import Link from "next/link";

import { ProductEditor } from "@/components/products/product-editor";

export default function EditProductPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link className="text-sm text-indigo-600" href="/products">
          ← Back to products
        </Link>
        <h1 className="my-6 text-2xl font-semibold">Edit product</h1>
        <ProductEditor />
      </div>
    </main>
  );
}
