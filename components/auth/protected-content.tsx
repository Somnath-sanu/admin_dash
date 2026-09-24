"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/token";

export function ProtectedContent({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [accessToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return getAccessToken();
    }
    return null;
  });

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <main className="grid min-h-screen place-items-center text-sm text-zinc-600">
        Checking your session…
      </main>
    );
  }

  return <>{children}</>;
}
