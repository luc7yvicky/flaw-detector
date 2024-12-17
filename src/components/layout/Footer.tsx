"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Footer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <footer
      className={cn(
        "relative max-h-[20.25rem] w-full bg-purple-light",
        isLandingPage ? "snap-start snap-always" : "",
      )}
    >
      {children}
    </footer>
  );
}
