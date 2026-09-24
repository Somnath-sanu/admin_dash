import { LogoutButton } from "@/components/auth/logout-button";

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
        <section className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
          Product browsing will be added in Stage 2.
        </section>
      </div>
    </main>
  );
}
