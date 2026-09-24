import type { Category } from "@/lib/api/products";

type ProductFiltersProps = {
  categories: Category[];
  category: string;
  order: "asc" | "desc";
  search: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onOrderChange: (order: "asc" | "desc") => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: string) => void;
};

export function ProductFilters({
  categories,
  category,
  order,
  search,
  sortBy,
  onCategoryChange,
  onOrderChange,
  onSearchChange,
  onSortChange,
}: ProductFiltersProps) {
  const isSearching = Boolean(search.trim());

  return (
    <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm text-zinc-700">
        Search products
        <input
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title"
          type="search"
          value={search}
        />
      </label>

      <label className="text-sm text-zinc-700">
        Category
        <select
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 disabled:bg-zinc-100"
          disabled={isSearching}
          onChange={(event) => onCategoryChange(event.target.value)}
          value={category}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm text-zinc-700">
        Sort by
        <select
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
          onChange={(event) => onSortChange(event.target.value)}
          value={sortBy}
        >
          <option value="">Default</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </label>

      <label htmlFor="order" className="text-sm text-zinc-700">
        Order
        <select
          id="order"
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 disabled:bg-zinc-100"
          onChange={(event) =>
            onOrderChange(event.target.value as "asc" | "desc")
          }
          value={order}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>

      {isSearching ? (
        <p className="text-xs text-zinc-500 sm:col-span-2 lg:col-span-4">
          Category filtering is unavailable while searching because DummyJSON
          does not support both together.
        </p>
      ) : null}
    </div>
  );
}
