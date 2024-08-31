import { Aldrich } from "next/font/google";
import Link from "next/link";
import { IconBug } from "../ui/Icons";

// Logo Font
const aldrich = Aldrich({ subsets: ["latin"], weight: "400" });

export default function Header() {
  return (
    <>
      <header className="h-[8.5rem] w-full antialiased">
        <div className="flex-center-center mx-auto h-full max-w-[120rem] py-12 pl-20 pr-[3.563rem]">
          {/* Logo */}
          <Link href={"/"} className="flex-center-center mr-[6.25rem]">
            <IconBug className="mr-3 h-[35px] w-[34px]" />
            <span
              className={`${aldrich.className} text-[2.5rem] tracking-[-0.01em]`}
            >
              FLAWDETECTOR
            </span>
          </Link>
          {/* Navigation */}
          <nav className="w-full">
            <ul className="flex-between-center w-full text-xl font-medium text-gray-dark">
              <li>
                <Link href={"/vuldb/items"}>취약점 DB</Link>
              </li>
              <li>
                <Link href={"/repos"}>MY 저장소</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
