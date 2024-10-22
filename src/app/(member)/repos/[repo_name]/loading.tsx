import { Status, StatusMessageSkeleton } from "@/components/analyze/Status";
import Button from "@/components/ui/Button";

export default function RepoLoading() {
  return (
    <section className="mx-auto mb-7 size-full min-w-[64rem] max-w-[110rem] animate-pulse px-[1rem]">
      {/* TitleBar */}
      <div className="mb-8 flex h-[4.875rem] w-full">
        <Button
          shape="pill"
          variant="outlined"
          className="size-[4.875rem] border-[0.25rem] border-gray-200"
        />
        <h1 className="ml-[1.5rem] h-[5.125rem] w-full rounded-full border-[0.25rem] border-gray-200" />
      </div>

      <div className="flex h-full min-h-dvh gap-7">
        <div className="flex w-full max-w-[16rem] flex-col gap-7">
          <Button className="pointer-events-none h-[6.75rem] bg-gray-200" />
          <Status>
            <StatusMessageSkeleton />
            <StatusMessageSkeleton />
            <StatusMessageSkeleton />
          </Status>

          {/* FileList */}
          <div className="h-[34.75rem] w-[16rem] rounded-lg border border-gray-200">
            <div className="flex-between-center border-b border-gray-200 px-3 py-5">
              <h2 className="h-[2rem] w-[3.583rem] rounded-lg bg-gray-200" />
              <div className="inline-flex gap-x-2">
                <div className="size-[2rem] rounded-lg bg-gray-200" />
                <div className="size-[2rem] rounded-lg bg-gray-200" />
              </div>
            </div>
            <ul>
              {Array.from({ length: 9 }).map((_, idx) => (
                <li
                  key={idx}
                  className="inline-flex h-[3.333rem] w-full items-center gap-x-2 border-b border-gray-200 px-4 py-2"
                >
                  <div className="size-[1.5rem] rounded-lg bg-gray-200" />
                  <span className="h-[1.5rem] w-[6rem] rounded-lg bg-gray-200" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CodeContainer */}
        <section className="max-h-[75.917rem] w-full rounded-lg border border-gray-200" />
      </div>
    </section>
  );
}
