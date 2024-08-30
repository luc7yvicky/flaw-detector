import { koreanLoremIpsum } from "@/lib/dummy";

export default function PpaPage() {
  return (
    <>
      <div className="flex-col-center-center gap-y-[0.625rem] text-white">
        <h1 className="text-[2rem] font-semibold leading-[2.8rem] tracking-[1.5%]">
          플로디텍터 일반 사용 약관
        </h1>
        <h2 className="flex-col-center-center text-xl font-medium leading-7">
          <span>모든 사업 관계에서 귀하는 일련의 약관에 동의합니다.</span>
          <span>
            본 약관은 플로디텍터 사용에 대해 당사가 귀하와 체결한 계약입니다.
          </span>
        </h2>
        <time>발행일 : 2024.08.28</time>
      </div>
      <p>{koreanLoremIpsum}</p>
    </>
  );
}
