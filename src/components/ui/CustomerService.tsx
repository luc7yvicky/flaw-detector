"use client";
import { cn } from "@/lib/utils";
import { Input } from "./Input";
import { TextArea } from "./TextArea";
import { useState } from "react";
import Modal from "./Modal";

export default function CustomerService({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<
    "selectFile" | "processing" | "login" | "inquirySubmitted"
  >("inquirySubmitted");

  const openModal = (
    variant: "selectFile" | "processing" | "login" | "inquirySubmitted",
  ) => {
    setModalVariant(variant);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onClickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    openModal("inquirySubmitted");
  };

  return (
    <section
      className={cn(
        "mx-auto flex h-[46rem] w-full max-w-[82.125rem] justify-between gap-[6.875rem]",
        className,
      )}
    >
      <div className="h-full w-[25.625rem]">
        <h2 className="text-5xl font-bold leading-[4.375rem] tracking-tighter text-primary-500">
          서비스 이용에
          <br />
          문제가 생겼나요?
        </h2>
        <p className="mt-8 text-lg font-medium leading-8 text-gray-default">
          이용하면서 문제가 생겼다면 언제든지 문의주세요. 서비스 개발과 성장에
          큰 도움이 됩니다.
        </p>
        <ul className="mt-[20.625rem]">
          <li className="mb-8 flex flex-col gap-2">
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
          "flex h-full w-full max-w-[49.625rem] flex-col gap-6 rounded-[2.5rem] border border-primary-500 bg-white px-12 py-10",
        )}
      >
        <div>
          <h3 className="mb-2 text-2xl font-bold leading-9">문의하기</h3>
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
            className="mt-2 h-56"
          />
        </div>
        <button
          type="button"
          className="rounded-lg bg-primary-500 py-[0.813rem] text-lg font-semibold text-white"
          onClick={() => openModal("inquirySubmitted")}
        >
          문의 보내기
        </button>
      </form>
      <Modal variant={modalVariant} isOpen={isOpen} onClose={closeModal} />
    </section>
  );
}
