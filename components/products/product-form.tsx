"use client";

import { FormEvent, useState } from "react";

import {
  addProduct,
  updateProduct,
  type ProductDetail,
  type ProductInput,
} from "@/lib/api/products";

const emptyProduct: ProductInput = {
  title: "",
  category: "",
  price: 0,
  stock: 0,
  description: "",
};

export function ProductForm({ product }: { product?: ProductDetail }) {
  const [values, setValues] = useState<ProductInput>(product || emptyProduct);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ProductDetail | null>(null);

  function setValue(key: keyof ProductInput, value: string | number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (
      !values.title.trim() ||
      !values.category.trim() ||
      values.price < 0 ||
      values.stock < 0
    ) {
      setError(
        "Title, category, and non-negative price and stock are required.",
      );
      return;
    }

    setSaving(true);
    setError("");
    try {
      const saved = product
        ? await updateProduct(product.id, values)
        : await addProduct(values);
      const completeProduct: ProductDetail = {
        ...product,
        ...saved,
        ...values,
        thumbnail: saved.thumbnail || product?.thumbnail || "/file.svg",
        images: saved.images || product?.images || [],
        reviews: saved.reviews || product?.reviews || [],
        rating: saved.rating ?? product?.rating ?? 0,
      };

      setSaved(completeProduct);
    } catch {
      setError("Unable to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <section className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h2 className="text-lg font-semibold">Product saved</h2>
        <p className="mt-2">
          {saved.title} — ${saved.price.toFixed(2)}
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          DummyJSON simulates this change, so it resets after refresh.
        </p>
      </section>
    );
  }

  return (
    <form
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6"
      onSubmit={submit}
    >
      <label className="block text-sm">
        Title
        <input
          className="mt-1 w-full rounded border p-2"
          onChange={(event) => setValue("title", event.target.value)}
          value={values.title}
        />
      </label>
      <label className="block text-sm">
        Category
        <input
          className="mt-1 w-full rounded border p-2"
          onChange={(event) => setValue("category", event.target.value)}
          value={values.category}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Price
          <input
            className="mt-1 w-full rounded border p-2"
            min="0"
            onChange={(event) => setValue("price", Number(event.target.value))}
            step="0.01"
            type="number"
            value={values.price}
          />
        </label>
        <label className="block text-sm">
          Stock
          <input
            className="mt-1 w-full rounded border p-2"
            min="0"
            onChange={(event) => setValue("stock", Number(event.target.value))}
            type="number"
            value={values.stock}
          />
        </label>
      </div>
      <label className="block text-sm">
        Description
        <textarea
          className="mt-1 w-full rounded border p-2"
          onChange={(event) => setValue("description", event.target.value)}
          rows={4}
          value={values.description}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 cursor-pointer"
        disabled={saving}
        type="submit"
      >
        {saving ? "Saving..." : "Save product"}
      </button>
    </form>
  );
}
