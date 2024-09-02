import { auth } from "@/auth";
import Image from "next/image";

export default async function Profile() {
  const session = await auth();
  return (
    <article className="inline-flex items-center gap-x-[2.75rem]">
      <Image
        src={session?.user.image || "/images/avatar.png"}
        alt="avatar"
        width={108}
        height={108}
        priority
        className="h-[6.688rem] w-[6.688rem] rounded-[50%]"
      />
      <p className="flex-col-start-center text-[2.5rem] font-medium leading-tight -tracking-[0.01em] text-gray-dark">
        <span>Hello,</span>
        <span>{session?.user.email || "marry@gmail.com"}</span>
      </p>
    </article>
  );
}
