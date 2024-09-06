"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import Button from "../ui/Button";

export default function ContactForm() {
  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`response status: ${res.status}`);
      }
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error, please try resubmitting the form");
    }
  };

  return (
    <form
      onSubmit={onSubmitForm}
      className={cn(
        "flex h-full w-[61.563rem] flex-col gap-8 rounded-[2.5rem] border border-primary-500 bg-white p-[3.75rem]",
      )}
    >
      <div>
        <h3 className="mb-6 text-2xl font-bold leading-9">문의하기</h3>
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
        <Input
          id="name"
          name="name"
          placeholder="이름을 적어주세요."
          className="mt-2"
        />
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
          name="email"
          type="email"
          autoComplete="email"
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
          name="message"
          placeholder="내용을 적어주세요."
          className="mt-2 h-52"
        />
      </div>
      <Button className="py-[0.813rem] text-lg">문의 보내기</Button>
    </form>
  );
}
