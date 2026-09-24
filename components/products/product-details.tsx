"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { ApiError } from "@/lib/api/client";
import {
  deleteProduct,
  getProduct,
  type ProductDetail,
} from "@/lib/api/products";

type Result = { key: string; product: ProductDetail };
type ErrorState = { key: string; notFound: boolean };

export function ProductDetails() {
  const params = useParams<{ id: string }>();
  const requestedId = Number(params.id);
  const isValidId = Number.isInteger(requestedId) && requestedId > 0;
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [retry, setRetry] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const key = `${params.id}|${retry}`;

  useEffect(() => {
    if (!isValidId) return;

    const controller = new AbortController();

    getProduct(requestedId, controller.signal)
      .then((product) => {
        if (!controller.signal.aborted) {
          setResult({ key, product });
          setError(null);
        }
      })
      .catch((caughtError) => {
        if (!controller.signal.aborted) {
          setError({
            key,
            notFound:
              caughtError instanceof ApiError && caughtError.status === 404,
          });
        }
      });

    return () => controller.abort();
  }, [isValidId, key, requestedId]);

  const loading = isValidId && result?.key !== key && error?.key !== key;
  const notFound = !isValidId || (error?.key === key && error.notFound);

  if (notFound) return <ProductNotFound />;

  if (deleted) {
    return (
      <ProductPageLayout>
        <section className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <h1 className="text-xl font-semibold">Product deleted</h1>
          <p className="mt-2 text-sm text-zinc-600">
            DummyJSON simulates this change, so it resets after refresh.
          </p>
        </section>
      </ProductPageLayout>
    );
  }

  if (error?.key === key) {
    return (
      <ProductPageLayout>
        <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p>Unable to load this product.</p>
          <button
            className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm text-white"
            onClick={() => setRetry((value) => value + 1)}
            type="button"
          >
            Retry
          </button>
        </section>
      </ProductPageLayout>
    );
  }

  if (loading || !result?.product) {
    return (
      <ProductPageLayout>
        <section className="p-6 text-center">Loading product...</section>
      </ProductPageLayout>
    );
  }

  const product = result.product;

  return (
    <ProductPageLayout>
      <article className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Image
            alt={product.title}
            className="h-80 w-full rounded-lg border border-zinc-200 object-cover"
            height={480}
            src={product.images[0] || product.thumbnail}
            width={640}
          />
          <div>
            <p className="text-sm capitalize text-indigo-600">
              {product.category}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{product.title}</h1>
            <p className="mt-4 leading-7 text-zinc-600">
              {product.description}
            </p>
            <p className="mt-5 text-2xl font-semibold">
              ${product.price.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Rating: {product.rating.toFixed(1)} / 5 · Stock: {product.stock}
            </p>
            <ProductActions
              onDeleted={() => setDeleted(true)}
              product={product}
            />
          </div>
        </div>

        {product.images.length > 1 ? (
          <div className="flex gap-3 overflow-x-auto">
            {product.images.slice(1).map((image) => (
              <Image
                alt=""
                className="h-20 w-20 rounded border border-zinc-200 object-cover"
                height={80}
                key={image}
                src={image}
                width={80}
              />
            ))}
          </div>
        ) : null}

        <section>
          <h2 className="text-xl font-semibold">Reviews</h2>
          {product.reviews.length ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {product.reviews.map((review, index) => (
                <article
                  className="rounded-lg border border-zinc-200 bg-white p-4"
                  key={`${review.reviewerName}-${index}`}
                >
                  <p className="font-medium">
                    {review.reviewerName} · {review.rating} / 5
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">No reviews yet.</p>
          )}
        </section>
      </article>
    </ProductPageLayout>
  );
}

function ProductPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-5">
          <Link
            className="text-sm font-medium text-indigo-600 hover:underline"
            href="/products"
          >
            ← Back to products
          </Link>
          <LogoutButton />
        </header>
        {children}
      </div>
    </main>
  );
}

function ProductNotFound() {
  return (
    <ProductPageLayout>
      <section className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-sm text-zinc-600">
          The product you requested does not exist.
        </p>
      </section>
    </ProductPageLayout>
  );
}

function ProductActions({
  product,
  onDeleted,
}: {
  product: ProductDetail;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function removeProduct() {
    if (deleting || !window.confirm(`Delete ${product.title}?`)) return;

    setDeleting(true);
    setError("");
    try {
      await deleteProduct(product.id);
      onDeleted();
    } catch {
      setError("Unable to delete product. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="mt-5 flex gap-3">
      <Link
        className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
        href={`/products/${product.id}/edit`}
      >
        Edit
      </Link>
      <button
        className="rounded bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50 cursor-pointer"
        disabled={deleting}
        onClick={removeProduct}
        type="button"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {error ? (
        <p className="self-center text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
