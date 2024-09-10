import { koreanLoremIpsum } from "@/lib/dummy";
import Image from "next/image";

export default function DocsLayout({
  children,
}: Readonly<{
  children: any;
}>) {
  return (
    <>
      <div className={`relative min-h-[44.25rem] w-full text-white`}>
        <Image
          src={"/images/docsBg.png"}
          alt="배경 이미지"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            zIndex: -1,
          }}
        />
        {children}
      </div>
      <p className="mx-auto min-h-[46.563rem] max-w-[120rem] whitespace-pre-wrap break-keep p-20 text-2xl font-normal leading-[2.1rem]">
        {koreanLoremIpsum}
      </p>
    </>
  );
}
