import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-100 px-4 py-10 text-zinc-950">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-indigo-600">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold">
          Log in to manage products
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Use the provided DummyJSON demo account to continue.
        </p>
        <div className="mt-7">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
