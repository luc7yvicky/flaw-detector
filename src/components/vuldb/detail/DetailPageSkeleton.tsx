import LabelSkeleton from "../common/LabelSkeleton";

function SimilarPostCardSkeleton() {
  return (
    <div className="relative flex h-[17.375rem] w-full max-w-[25.875rem] animate-pulse flex-col justify-between gap-6 rounded-[1.25rem] border border-line-default p-7">
      <div className="flex-col-center-start relative h-fit flex-wrap items-center gap-2">
        <LabelSkeleton />
        <div className="mb-2 mt-2 h-7 w-full rounded bg-gray-200" />
        <div className="h-7 w-full rounded bg-gray-200" />
      </div>
      <div className="h-6 w-full rounded bg-gray-200" />
      <div className="flex items-center justify-between">
        <div className="inline-flex gap-4">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </div>
        <div className="h-5 w-1/6 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function DetailPageSkeleton() {
  return (
    <>
      {/* DetailHeader */}
      <section className="w-full max-w-[82.125rem] border-b border-b-line-default p-[1.75rem_0_3.75rem_0] px-[1rem]">
        <LabelSkeleton />
        <div className="mb-8 mt-[1.261rem] h-9 w-4/5 rounded bg-gray-200"></div>
        <div className="flex items-center justify-between text-xl font-normal leading-[1.512rem] text-gray-default">
          <div className="flex gap-9 tracking-[-0.01em]">
            <div className="h-6 w-40 rounded bg-gray-200"></div>
            <div className="flex gap-1">
              <div className="h-6 w-24 rounded bg-gray-200"></div> |
              <div className="h-6 w-40 rounded bg-gray-200"></div>
            </div>
            <div className="flex gap-1">
              <div className="h-6 w-24 rounded bg-gray-200"></div> |
              <div className="h-6 w-40 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="relative flex gap-[1.625rem]">
            <div className="h-7 w-7 rounded-full bg-gray-200"></div>
            <div className="h-7 w-7 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </section>

      {/* DetailContent */}
      <div className="mb-14 h-[62.5rem] w-full max-w-[80.25rem] animate-pulse rounded bg-gray-200"></div>

      {/* SimilarPostList */}
      <section className="w-full max-w-[82.125rem]">
        <h2 className="mb-4 text-2xl font-semibold leading-[1.816rem] tracking-[-0.01em]">
          비슷한 정보글
        </h2>
        <div className="grid grid-cols-3 gap-9">
          {Array.from({ length: 6 }).map((_, index) => (
            <SimilarPostCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </>
  );
}
