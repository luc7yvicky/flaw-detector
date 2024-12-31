"use client";

import { useSessionStore } from "@/context/SessionProvider";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";

export type RequestState = "idle" | "loading" | "success" | "error";
type InvalidField = "name" | "email" | "message";

const NAME_VALIDATION_MESSAGE = "이름은 공백 없이 2자 이상이어야 합니다.";
const EMAIL_VALIDATION_MESSAGE = "이메일 형식이 유효하지 않습니다.";
const MESSAGE_VALIDATION_MESSAGE = "메세지는 5자 이상이어야 합니다.";
const SERVER_ERROR_MESSAGE =
  "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

const ContactSuccessModal = dynamic(
  () => import("@/components/me/ContactModal"),
  {
    ssr: false,
  },
);

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

export default function ContactForm() {
  const { user } = useSessionStore((state) => state);
  const [invalidField, setInvalidField] = useState<InvalidField | null>(null);
  const [requestState, setRequestState] = useState<RequestState>("idle");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

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
            name: user?.name || "",
            email: user?.email || "",
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
      className="flex size-full max-w-[61.563rem] flex-col gap-8 rounded-[2.5rem] border border-primary-500 bg-white px-[3.75rem] py-12"
    >
      <div>
        <p className="mb-4 text-2xl font-bold leading-9">문의하기</p>
        <p className="text-base font-medium tracking-[-0.011em] text-gray-default">
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
      {requestState === "success" && (
        <ContactSuccessModal
          requestState={requestState}
          setRequestState={setRequestState}
        />
      )}
    </form>
  );
}
