import LabelSkeleton from "../common/LabelSkeleton";

function PostCardSkeleton() {
  return (
    <div className="relative flex h-[16.875rem] w-full max-w-[54.063rem] animate-pulse flex-col justify-between gap-6 rounded-[1.25rem] border border-line-light p-7">
      <div className="flex-col-center-start relative h-fit flex-wrap items-center gap-0">
        <div className="mb-3 flex items-center gap-2">
          <LabelSkeleton />
          {/* Label */}
          <div className="h-7 w-4/5 rounded bg-gray-200"></div> {/* Title */}
        </div>
        <div className="h-5 w-1/12 rounded bg-gray-200"></div> {/* Subtitle */}
      </div>
      <div className="h-[3.688rem] w-full rounded-2xl bg-gray-200 p-5" />
      {/* Content */}
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="h-7 w-7 rounded-full bg-gray-200"></div>
          {/* ScrapButton */}
          <div className="h-7 w-7 rounded-full bg-gray-200"></div>
          {/* ShareButton */}
        </div>
        <div className="h-6 w-16 rounded bg-gray-200"></div> {/* Date */}
      </div>
    </div>
  );
}

export default function VulDBMainSkeleton() {
  return (
    <section className="relative w-full min-w-[54.063rem]">
      <div className="flex-between-center mb-8 max-w-[54.063rem]">
        <h2 className="text-2xl font-semibold leading-[1.816rem] tracking-[-0.01em]">
          취약점 DB
        </h2>
        <div className="flex-end-center gap-3">
          <LabelSkeleton />
          <LabelSkeleton />
          <LabelSkeleton />
        </div>
      </div>
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index}>
            <PostCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}
