"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Input } from "./Input";
import { TextArea } from "./TextArea";

export default function CustomerService() {
  const pathName = usePathname();

  return (
    <section
      className={cn(
        "mx-auto flex h-[51.063rem] justify-between",
        pathName === "/" ? "my-[6.5rem] w-[96.125rem]" : "w-full", // landing 페이지와 고객 센터 페이지의 레이아웃을 다르게 설정
      )}
    >
      <div className="h-full w-[28.125rem]">
        <h2 className="text-6xl font-bold leading-[5.625rem] tracking-tighter text-primary-500">
          서비스 이용에
          <br />
          문제가 생겼나요?
        </h2>
        <p className="mt-8 text-xl font-medium leading-8 text-gray-default">
          이용하면서 문제가 생겼다면 언제든지 문의주세요. 서비스 개발과 성장에
          큰 도움이 됩니다.
        </p>
        <ul className="mt-[22.5rem] h-[11.313rem]">
          <li className="mb-[3.188rem] flex flex-col gap-2">
            <span className="text-xl font-semibold leading-[1.875rem] text-gray-dark">
              Email
            </span>
            <span className="text-lg font-normal text-gray-default">
              justin@floatfactory.kr
            </span>
          </li>
          <li className="flex flex-col gap-2">
            <span className="text-xl font-semibold leading-[1.875rem] text-gray-dark">
              Adress
            </span>
            <span className="text-lg font-normal text-gray-default">
              서울 강서구 마곡중앙2로 11 305호
            </span>
          </li>
        </ul>
      </div>
      <form
        className={cn(
          "flex h-full flex-col gap-8 rounded-[40px] border border-primary-500 bg-white p-[3.75rem]",
          pathName === "/" ? "w-[61.563rem]" : "w-[47.563rem]", // landing 페이지와 고객 센터 페이지에서 form 레이아웃을 다르게 설정
        )}
      >
        <div>
          <h3 className="mb-5 text-2xl font-bold leading-9">문의하기</h3>
          <p className="text-base font-medium tracking-[-0.011em] text-[#8F8F8F]">
            문의하고싶은 내용을 구체적으로 작성해주셔야 피드백이 정상적으로
            반영됩니다.
          </p>
        </div>
        <div>
          <label
            htmlFor="name"
            className="text-lg font-medium leading-[1.688rem]"
          >
            Name
          </label>
          <Input id="name" placeholder="이름을 적어주세요." className="mt-2" />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-lg font-medium leading-[1.688rem]"
          >
            Email
          </label>
          <Input
            id="email"
            placeholder="justin@floatfactory.kr"
            disabled
            className="mt-2"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="text-lg font-medium leading-[1.688rem]"
          >
            Message
          </label>
          <TextArea
            id="message"
            placeholder="내용을 적어주세요."
            className="mt-2 h-[14.125rem]"
          />
        </div>
        <button className="rounded-lg bg-primary-500 py-[0.813rem] text-lg font-semibold text-white">
          문의 보내기
        </button>
      </form>
    </section>
  );
}
