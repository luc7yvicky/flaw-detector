import Image from "next/image";
import TitleBar from "../ui/TitleBar";

export const RepoHeader = () => {
  return (
    <>
      <Image
        src="/images/myReposBg.png"
        alt="my repos bg"
        width={1920}
        height={1272}
        priority
        className="absolute left-0 -z-10"
      />
      <div className="flex-col-center-center mt-[3.5rem] gap-y-5">
        <span className="text-[3.75rem] font-light leading-[1.2] -tracking-[0.01em] text-primary-500">
          containing code files
        </span>
        <TitleBar
          title="My Library"
          align="center"
          className="mb-0 h-full bg-white"
          h1ClassName="border-[0.25rem] px-10 py-[1.156rem] text-[3.75rem] leading-[1.1]"
          hasBackButton={false}
        />
      </div>
    </>
  );
};
