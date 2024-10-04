import { exampleCode } from "@/lib/dummy";
import ProcessStatus from "../../../components/analyze/ProcessStatus";
import Button from "../../../components/ui/Button";

export default function LandingDemoSection() {
  return (
    <section className="flex-end-center relative max-h-screen min-h-dvh w-full overflow-y-clip px-[9.063rem]">
      <article className="absolute left-[12rem] top-[5.7rem] w-[45.313rem] overflow-x-visible rounded-lg border border-neutral-30 p-10">
        <div className="flex h-[61rem] flex-col">
          <ProcessStatus status="inProgress" />
          <div>
            <code className="block size-full whitespace-pre-wrap text-sm font-medium leading-tight -tracking-[0.011em] blur-[6px]">
              {exampleCode}
            </code>
            <Button
              variant="filled"
              shape="rounded"
              className="absolute top-[15.7%] z-40 translate-x-[42%] whitespace-nowrap bg-primary-300 px-[0.625rem] py-2 font-normal shadow-[0_1.5rem_2.25rem_0_rgba(0,0,0,0.25)]"
            >
              SectionBusinessForever from
              "@/components/section-business-forever";
            </Button>
            <Button
              variant="filled"
              shape="rounded"
              className="absolute top-[29%] z-40 translate-x-[56.5%] bg-primary-300 px-[0.625rem] py-2 font-normal shadow-[0_1.5rem_2.25rem_0_rgba(0,0,0,0.25)]"
            >
              "flex flex-col items-center py-36 min-h-screen"
            </Button>
            <Button
              variant="filled"
              shape="rounded"
              className="absolute bottom-[27.4%] z-40 translate-x-[27%] bg-primary-300 px-[0.625rem] py-2 font-normal shadow-[0_1.5rem_2.25rem_0_rgba(0,0,0,0.25)]"
            >
              Card className
            </Button>
          </div>
        </div>
      </article>
      <article className="mt-[7%] flex w-fit flex-col gap-y-[2.125rem]">
        <h3 className="flex-col-end-center w-full space-y-3 truncate text-[3.75rem] font-bold leading-[4.538rem] -tracking-[0.011em] text-primary-500">
          <span>최신 보안 동향을</span>
          <span>실시간으로 확인하세요.</span>
        </h3>
        <p className="flex-col-end-center w-full space-y-2 text-xl font-medium leading-[1.513rem] -tracking-[0.011em] text-gray-default">
          <span>실시간으로 최신 보안 동향을 제공하여</span>
          <span>개발자들이 보안 취약점에 대한 최신 정보를 받을 수 있어</span>
          <span>
            보안 강화를 위한 코딩 관행을 지속적으로 개선할 수 있습니다.
          </span>
        </p>
      </article>
    </section>
  );
}
