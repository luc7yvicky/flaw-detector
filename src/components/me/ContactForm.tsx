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
import {
  SERVER_ERROR_MESSAGE,
  EMAIL_VALIDATION_MESSAGE,
  MESSAGE_VALIDATION_MESSAGE,
  NAME_VALIDATION_MESSAGE,
} from "@/lib/const";

type RequestState = "idle" | "loading" | "success" | "error";
type InvalidField = "name" | "email" | "message";

function ValidationError({
  invalidField,
}: {
  invalidField: InvalidField | null;
}) {
  const validationMessages: { [key in InvalidField]: string } = {
    name: NAME_VALIDATION_MESSAGE,
    email: EMAIL_VALIDATION_MESSAGE,
    message: MESSAGE_VALIDATION_MESSAGE,
  };

  if (!invalidField) {
    return null;
  }

  return (
    <p className="mt-1 text-lg font-semibold text-red-500">
      {validationMessages[invalidField]}
    </p>
  );
}

function ContactSuccessModal({
  requestState,
  setRequestState,
}: {
  requestState: RequestState;
  setRequestState: React.Dispatch<React.SetStateAction<RequestState>>;
}) {
  const router = useRouter();

  return (
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
  );
}

export default function ContactForm() {
  const { data: session } = useSession();
  const [invalidField, setInvalidField] = useState<InvalidField | null>(null);
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
        case NAME_VALIDATION_MESSAGE:
          setInvalidField("name");
          setRequestState("idle");
          break;
        case EMAIL_VALIDATION_MESSAGE:
          setInvalidField("email");
          setRequestState("idle");
          break;
        case MESSAGE_VALIDATION_MESSAGE:
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
        default:
          setRequestState("error");
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
        "flex h-full w-[61.563rem] flex-col gap-8 rounded-[2.5rem] border border-primary-500 bg-white px-[3.75rem] py-12",
      )}
    >
      <div>
        <h3 className="mb-4 text-2xl font-bold leading-9">문의하기</h3>
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
        {invalidField === "name" && <ValidationError invalidField="name" />}
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
        {invalidField === "email" && <ValidationError invalidField="email" />}
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
        {invalidField === "message" && (
          <ValidationError invalidField="message" />
        )}
      </div>
      <div>
        {/* Message for SERVER ERROR */}
        {requestState === "error" && (
          <p className="mb-2 text-lg font-semibold text-red-500">
            {SERVER_ERROR_MESSAGE}
          </p>
        )}

        {/* Button for SUBMIT */}
        <Button type="submit" className="w-full py-[0.813rem] text-lg">
          {requestState === "loading" ? "전송 중..." : "문의 보내기"}
        </Button>
      </div>

      {/* Modal for SUCCESS */}
      <ContactSuccessModal
        requestState={requestState}
        setRequestState={setRequestState}
      />
    </form>
  );
}
