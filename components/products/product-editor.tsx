"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ProductForm } from "@/components/products/product-form";
import { getProduct, type ProductDetail } from "@/lib/api/products";

export function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    if (!Number.isInteger(productId) || productId <= 0) return;
    getProduct(productId)
      .then(setProduct)
      .catch(() => {
        setProduct(null);
        router.replace("/products");
      });
  }, [productId, router]);

  if (!product) {
    return <section className="p-6 text-center">Loading product...</section>;
  }

  return <ProductForm product={product} />;
}
