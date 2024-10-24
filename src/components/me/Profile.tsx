"use client";

import { useSessionStore } from "@/context/SessionProvider";
import Image from "next/image";

export default function Profile() {
  const { user, status } = useSessionStore((state) => state);

  return (
    <>
      {status.loading ? (
        <article className="flex-start-center h-fit animate-pulse gap-x-[2.75rem] rounded-[2.625rem]">
          <div className="h-[6.688rem] w-[6.688rem] rounded-[50%] bg-gray-light" />
          <p className="flex-col-start-center gap-y-2">
            <span className="h-[2.8rem] w-[6.288rem] rounded-xl bg-gray-light" />
            <span className="h-[2.8rem] w-[26.667rem] rounded-xl bg-gray-light" />
          </p>
        </article>
      ) : (
        <article className="inline-flex items-center gap-x-[2.75rem]">
          <Image
            src={user.image || "/images/avatar.png"}
            alt={`${user.username}의 아바타`}
            width={108}
            height={108}
            priority
            className="h-[6.688rem] w-[6.688rem] rounded-[50%]"
          />
          <p className="flex-col-start-center text-[2.5rem] font-medium leading-tight -tracking-[0.01em] text-gray-dark">
            <span>Hello,</span>
            <span>{user.email || "marry@gmail.com"}</span>
          </p>
        </article>
      )}
    </>
  );
}
