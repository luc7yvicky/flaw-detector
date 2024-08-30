import { koreanLoremIpsum } from "@/lib/dummy";

export default function AgreementsPage() {
  return (
    <>
      <div className="flex-col-center-center gap-y-[0.625rem] text-white">
        <h1 className="text-[2rem] font-semibold leading-[2.8rem] tracking-[1.5%]">
          우리는 당신의 개인정보 보호와 신뢰를 중요하게 생각합니다.
        </h1>
        <h2 className="flex-col-center-center text-xl font-medium leading-7">
          <span>개인정보 보호 센터는 고객의 정보를 수집해서</span>
          <span>사용하는 방법에 대한 고객의 선택 사항을 비롯하여</span>
          <span>
            개인정보 보호 항목에 대한 정보를 쉽게 찾을 수 있도록 해 줍니다.
          </span>
        </h2>
      </div>
      <p>{koreanLoremIpsum}</p>
    </>
  );
}
