import Image from "next/image";

export default function Profile({
  avatar,
  email,
}: {
  avatar: string;
  email: string;
}) {
  return (
    <article className="inline-flex items-center gap-x-[2.75rem]">
      <Image
        src={avatar}
        alt="avatar"
        width={108}
        height={108}
        priority
        className="h-[6.688rem] w-[6.688rem] rounded-[50%]"
      />
      <p className="flex-col-start-center text-[2.5rem] font-medium leading-tight -tracking-[0.01em] text-gray-dark">
        <span>Hello,</span>
        <span>{email}</span>
      </p>
    </article>
  );
}
