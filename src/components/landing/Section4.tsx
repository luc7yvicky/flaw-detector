import ServiceCard from "../ui/ServiceCard";

export default function Section4() {
  return (
    <>
      {/* max-h-screen */}
      <section className="flex min-h-dvh w-full flex-col gap-y-[7.5rem] bg-primary-500">
        <article className="pt-[8.898rem]">
          <p className="flex-col-center-center space-y-3 text-[3.75rem] font-bold leading-[4.538rem] -tracking-[0.011em] text-white">
            <span>안전과 보호를 우선으로 하는</span>
            <span>프로세스를 제공합니다.</span>
          </p>
        </article>
        <article className="relative w-full overflow-x-hidden">
          <div className="relative ml-[-10.604rem] grid min-h-[35rem] w-[120%] grid-cols-6 gap-x-12 overflow-x-hidden whitespace-pre-wrap">
            <ServiceCard variant="security" />
            <ServiceCard variant="critical" />
            <ServiceCard variant="realtime" />
            <ServiceCard variant="privacy" />
            <ServiceCard variant="efficiency" />
            <ServiceCard variant="quick" />
          </div>
        </article>
      </section>
    </>
  );
}
