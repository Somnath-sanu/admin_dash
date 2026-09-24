"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getAccessToken, setAccessToken } from "@/lib/auth/token";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getAccessToken()) router.replace("/products");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (!username.trim() || !password) {
      setError("Enter both a username and password.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be of length 4 or more");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login({ username: username.trim(), password });
      setAccessToken(user.accessToken);
      router.replace("/products");
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="w-full max-w-sm space-y-5"
      noValidate
      onSubmit={handleSubmit}
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="username">
          Email
        </label>
        <input
          autoComplete="email"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none ring-indigo-500 focus:ring-2"
          disabled={isSubmitting}
          id="username"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none ring-indigo-500 focus:ring-2"
          disabled={isSubmitting}
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </div>
      {error ? (
        <p
          aria-live="polite"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
      <button
        className="w-full rounded-md bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
