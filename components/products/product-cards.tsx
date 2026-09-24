import Image from "next/image";

import type { Product } from "@/lib/api/products";

export function ProductCards({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3"
        >
          <Image
            alt=""
            className="h-20 w-20 shrink-0 rounded-md border border-zinc-100 object-cover"
            height={80}
            src={product.thumbnail}
            width={80}
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-medium text-zinc-900">
              {product.title}
            </h2>
            <p className="mt-1 text-sm capitalize text-zinc-600">
              {product.category}
            </p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-xs text-zinc-600">
              <div>
                <dt>Price</dt>
                <dd className="mt-0.5 font-medium text-zinc-900">
                  ${product.price.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd className="mt-0.5 font-medium text-zinc-900">
                  {product.rating.toFixed(1)} / 5
                </dd>
              </div>
              <div>
                <dt>Stock</dt>
                <dd className="mt-0.5 font-medium text-zinc-900">
                  {product.stock}
                </dd>
              </div>
            </dl>
          </div>
        </article>
      ))}
    </div>
  );
}
