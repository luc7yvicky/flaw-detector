"use client";

import { Aldrich } from "next/font/google";
import Link from "next/link";
import IconBug from "../ui/icons/IconBug";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// Logo Font
const aldrich = Aldrich({ subsets: ["latin"], weight: "400" });

function HeaderLogo({ isDocsPage }: { isDocsPage: boolean }) {
  return (
    <Link
      href={"/"}
      className="flex-center-center mr-[6.25rem]"
      aria-label="FLAWDETECTOR 홈으로 이동"
    >
      <IconBug
        color={isDocsPage ? "text-white" : "text-primary-500"}
        className={cn("mr-3 h-[35px] w-[34px]", isDocsPage && "text-white")}
      />
      <span
        className={`${aldrich.className} hidden text-[2.5rem] tracking-[-0.01em] md:block`}
      >
        FLAWDETECTOR
      </span>
    </Link>
  );
}

function NavMenu({ isDocsPage }: { isDocsPage: boolean }) {
  return (
    <nav className="w-full">
      <ul
        className={cn(
          "flex-end-center h-[8.5rem] w-full space-x-8 text-xl font-medium md:space-x-20",
          isDocsPage ? "text-white" : "text-gray-dark",
        )}
      >
        <li>
          <Link prefetch href={"/vuldb/items"}>
            취약점 DB
          </Link>
        </li>
        <li>
          <Link prefetch href={"/repos"}>
            MY 저장소
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default function Header() {
  const pathName = usePathname();
  const isDocsPage = pathName === "/ppa" || pathName === "/agreements";

  return (
    <header
      className={cn(
        "top-0 z-50 h-[8.5rem] w-full antialiased",
        isDocsPage
          ? "fixed border-b border-white bg-transparent text-white backdrop-blur-md"
          : "sticky bg-white",
      )}
    >
      <div className="flex-center-center mx-auto h-full max-w-[120rem] px-12 py-12 md:px-20">
        <HeaderLogo isDocsPage={isDocsPage} />
        <NavMenu isDocsPage={isDocsPage} />
      </div>
    </header>
  );
}
