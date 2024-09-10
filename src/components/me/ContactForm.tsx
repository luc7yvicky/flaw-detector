"use client";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Modal,
  ModalDescription,
  ModalTitle,
  ModalTitleWrapper,
} from "../ui/Modal";
import { TextArea } from "../ui/TextArea";

type RequestState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [invalidField, setInvalidField] = useState<
    "name" | "email" | "message" | null
  >(null);
  const [requestState, setRequestState] = useState<RequestState>("idle");

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    message: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const onChangeInputAndTextArea = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestState("loading");
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "post",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`response status: ${res.status}`);
      }

      const { message: responseMessage } = await res.json();

      switch (responseMessage) {
        case "INVALID NAME":
          setInvalidField("name");
          setRequestState("idle");
          break;
        case "INVALID EMAIL":
          setInvalidField("email");
          setRequestState("idle");
          break;
        case "INVALID MESSAGE":
          setInvalidField("message");
          setRequestState("idle");
          break;
        case "SUCCESS":
          setInvalidField(null);
          setRequestState("success");

          setFormData({
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            message: "",
          });
          break;
      }
    } catch (error) {
      console.error(error);
      setRequestState("error");
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
          isErrored={invalidField === "name"}
          id="name"
          name="name"
          placeholder="이름을 적어주세요."
          className="mt-2"
          value={formData.name}
          onChange={onChangeInputAndTextArea}
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
          isErrored={invalidField === "email"}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="올바른 이메일을 적어주세요."
          className="mt-2"
          value={formData.email}
          onChange={onChangeInputAndTextArea}
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
          isErrored={invalidField === "message"}
          id="message"
          name="message"
          placeholder="내용을 적어주세요."
          className="mt-2 h-52"
          value={formData.message}
          onChange={onChangeInputAndTextArea}
        />
      </div>
      <Button type="submit" className="py-[0.813rem] text-lg">
        {requestState === "loading" ? "전송 중..." : "문의 보내기"}
      </Button>

      {/* Modal for SUCCESS */}
      <Modal
        variant="inquirySubmitted"
        size="extraLarge"
        isOpen={requestState === "success"}
        className="top-0 border border-primary-500"
      >
        <ModalTitleWrapper variant="inquirySubmitted">
          <ModalTitle size="big" weight="bold">
            문의를 보냈어요!
          </ModalTitle>
          <ModalDescription size="big" className="font-medium text-[#8F8F8F]">
            문의를 성공적으로 전송했어요. 빠른 시일 내에 답변해드릴게요.
          </ModalDescription>
        </ModalTitleWrapper>
        <Button
          type="button"
          onClick={() => {
            setRequestState("idle");
            router.push("/");
          }}
          className="mt-14 h-14 w-[20.938rem] rounded-2xl text-[1.25rem] tracking-[-0.011em]"
        >
          홈으로 가기
        </Button>
      </Modal>
    </form>
  );
}
