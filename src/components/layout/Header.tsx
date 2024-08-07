import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="flex px-[80px] py-[48px] antialiased">
        <Link
          href={"/"}
          className="logo mr-[100px] flex h-[40px] items-center font-bold"
        >
          FLAWDETECTOR
        </Link>
        <ul className="flex w-full items-center justify-between font-medium text-[#3f3f3f]">
          <li className="">
            <Link href={"/vulnerability-db"}>취약점 DB</Link>
          </li>
          <li>
            <Link href={"/repos"}>MY 저장소</Link>
          </li>
        </ul>
      </header>
    </>
  );
}
