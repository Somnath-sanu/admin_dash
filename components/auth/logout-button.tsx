"use client";

import { useRouter } from "next/navigation";
import { clearAccessToken } from "@/lib/auth/token";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearAccessToken();
    router.replace("/login");
  }

  return (
    <button
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
      onClick={handleLogout}
      type="button"
    >
      Log out
    </button>
  );
}
