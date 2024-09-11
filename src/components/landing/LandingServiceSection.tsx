import ServiceCard from "./ServiceCard";

export default function LandingServiceSection() {
  return (
    <>
      {/* max-h-screen */}
      <section className="flex min-h-dvh w-full flex-col gap-y-[7.5rem] bg-primary-500">
        <article className="pt-[8.898rem]">
          <h3 className="flex-col-center-center space-y-3 text-[3.75rem] font-bold leading-[4.538rem] -tracking-[0.011em] text-white">
            <span>안전과 보호를 우선으로 하는</span>
            <span>프로세스를 제공합니다.</span>
          </h3>
        </article>
        <article className="relative w-full overflow-x-hidden">
          {/* <div className="animate-scroll-left gap-x-15 relative ml-[-10.604rem] grid min-h-[35rem] w-[120%] grid-cols-6"> */}
          <div className="animate-scroll-left flex min-h-[35rem] w-auto flex-nowrap gap-x-12">
            <ServiceCard
              variant="security"
              className="w-[339px] flex-shrink-0"
            />
            <ServiceCard
              variant="critical"
              className="w-[339px] flex-shrink-0"
            />
            <ServiceCard
              variant="realtime"
              className="w-[339px] flex-shrink-0"
            />
            <ServiceCard
              variant="privacy"
              className="w-[339px] flex-shrink-0"
            />
            <ServiceCard
              variant="efficiency"
              className="w-[339px] flex-shrink-0"
            />
            <ServiceCard variant="quick" className="w-[339px] flex-shrink-0" />
            <ServiceCard
              variant="security"
              className="w-[339px] flex-shrink-0"
            />
            <ServiceCard
              variant="critical"
              className="w-[339px] flex-shrink-0"
            />
            <ServiceCard
              variant="realtime"
              className="w-[339px] flex-shrink-0"
            />
          </div>
        </article>
      </section>
    </>
  );
}
