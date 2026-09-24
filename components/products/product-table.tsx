import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/api/products";

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-zinc-200 bg-white md:block">
      <table className="w-full min-w-190 text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Image
                    alt=""
                    className="h-11 w-11 rounded-md border border-zinc-100 object-cover"
                    height={44}
                    src={product.thumbnail}
                    width={44}
                  />
                  <Link className="font-medium text-zinc-900 hover:text-indigo-600" href={`/products/${product.id}`}>
                    {product.title}
                  </Link>
                </div>
              </td>
              <td className="px-4 py-3 capitalize text-zinc-600">
                {product.category}
              </td>
              <td className="px-4 py-3 font-medium">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3">{product.rating.toFixed(1)} / 5</td>
              <td className="px-4 py-3">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
