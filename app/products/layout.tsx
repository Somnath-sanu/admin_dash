import { ProtectedContent } from "@/components/auth/protected-content";

export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return <ProtectedContent>{children}</ProtectedContent>;
}
