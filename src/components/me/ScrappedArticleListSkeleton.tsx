import { Card, CardHeader } from "../ui/Card";

function ScrappedArticleListItemSkeleton({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <Card
      size="extended"
      className="pointer-events-none animate-pulse border-line-light"
      style={style}
    >
      <CardHeader>
        <div className="h-[2.375rem] w-[6.861rem] rounded-full bg-gray-200" />
      </CardHeader>
      <div className="h-9 rounded-lg bg-gray-200" />
      <div className="h-[1.5rem] w-24 rounded-lg bg-gray-200" />
    </Card>
  );
}

export default function ScrappedArticleListSkeleton() {
  const opacityLevels = [1, 0.75, 0.5, 0.2];
  return (
    <>
      <div className="inline-flex h-11 items-center justify-between">
        {/* Title */}
        <h2 className="h-[3rem] w-[7.2rem] rounded-xl bg-gray-200" />

        {/* Filter */}
        <div className="inline-flex gap-x-[0.563rem]">
          <button className="h-[2.75rem] w-[6rem] cursor-default rounded-xl bg-gray-200" />
          <button className="h-[2.75rem] w-[6rem] cursor-default rounded-xl bg-gray-200" />
        </div>
      </div>

      <section className="flex flex-col gap-y-12 last:gap-y-[7.75rem]">
        <div className="flex-between-center relative grid grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <ScrappedArticleListItemSkeleton
              key={idx}
              style={{ opacity: opacityLevels[Math.floor(idx / 3)] }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
