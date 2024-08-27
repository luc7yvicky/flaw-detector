import { useRouter } from "next/navigation";
import clsx from "clsx";
import { cva, VariantProps } from "class-variance-authority";
import { IconBug, IconRoundedDoc } from "./Icons";
import Button from "./Button";

const modalVariants = cva("relative bg-white rounded-[1.25rem]", {
  variants: {
    variant: {
      selectFile: "",
      processing: "",
      login: "rounded-[1.25rem] shadow-[0_0_1.55rem_rgba(0,0,0,0.25)]",
      inquirySubmitted: "rounded-[2.5rem]",
    },
    size: {
      small:
        "w-[21.313rem] h-[13.125rem] top-[15.375rem] p-[2.5rem_3.75rem] gap-[2rem]", //login
      medium: "w-[26.688rem] h-[24.063rem] top-[10rem] p-[3rem] gap-[3.313rem]", //processing
      large: "w-[42.875rem] h-[29.875rem] p-[3rem] gap-[2.5rem] top-[10rem]", //selectFile
      extraLarge:
        "w-[61.563rem] h-[21.563rem] p-[3.75rem] gap-[3.5rem] top-[10rem]", //inquirySubmitted
    },
  },
  defaultVariants: {
    variant: "selectFile",
    size: "large",
  },
});

export type ModalProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof modalVariants> & {
    isOpen: boolean;
    onClose: () => void;
    onProceed?: () => void;
  };

export default function Modal({
  variant,
  size,
  isOpen,
  onClose,
  onProceed,
  className,
  children,
  ...props
}: ModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const renderContent = () => {
    switch (variant) {
      case "selectFile":
        return (
          <>
            <h2 className="mb-10 text-center text-2xl font-normal leading-[1.816rem] tracking-[-0.01em]">
              선택된 파일을 검사하시겠습니까?
            </h2>
            {[...Array(5)].map((_, ulIndex) => (
              <ul
                key={ulIndex}
                className={clsx(
                  "h-11 w-[36.875rem] border border-b border-[#bcbcbc] p-[0.625rem]",
                  {
                    "rounded-t-lg": ulIndex === 0,
                    "rounded-b-lg": ulIndex === 4,
                  },
                )}
              >
                <li className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconRoundedDoc className="mr-[0.625rem]" />

                    <div className="font-medium">file name</div>
                  </div>
                  <div className="text-xs font-normal leading-[0.907rem] tracking-[-0.01em] text-[#9E9E9E]">
                    file sub title
                  </div>

                  <div className="text-xs leading-[0.907rem] tracking-[-0.01em] text-[#9E9E9E]">
                    4 months ago
                  </div>
                </li>
              </ul>
            ))}
            <div className="mt-10 flex justify-center space-x-4">
              <button
                className="flex h-[3.313rem] w-[5.75rem] items-center justify-center gap-[0.625rem] rounded-xl border border-[#6100FF] p-[0.75rem_1.5rem] text-[#6100FF]"
                onClick={onClose}
              >
                닫기
              </button>
              {/* 임시버튼 */}
              <button
                className="h-[3.313rem] w-[8.5rem] gap-[0.625rem] rounded-xl bg-primary-500 p-[0.75rem_1.5rem] text-white"
                onClick={onProceed}
              >
                검사하기
              </button>
            </div>
          </>
        );
      case "processing":
        return (
          <div className="flex h-full flex-col items-center justify-center gap-[3.313rem] text-center">
            <IconBug width="106" height="109" />
            <div className="h-[7.938rem] w-[22.688rem] gap-[2.375rem]">
              <h2 className="mb-[2.375rem] text-[1.5rem] font-semibold leading-[1.816rem] tracking-[-0.01em] text-gray-dark">
                소스코드 취약점 분석중
              </h2>
              <p className="h-[3.75rem] text-center text-[1.25rem] font-medium leading-[1.875rem] tracking-[-0.01em] text-gray-default">
                AI 플로디텍터가 문제를 분석중입니다.
                <br />
                코드가 많을수록 처리시간이 길어집니다.
              </p>
            </div>
          </div>
        );
      case "login":
        return (
          <div className="flex w-[15rem] flex-col items-center justify-center text-center">
            <h2 className="mb-8 h-6 w-[15rem] text-[1.25rem] font-semibold leading-[1.512rem] tracking-[-0.01em]">
              자세한 정보를 보고싶다면?
            </h2>
            <button className="h-[4.625rem] w-[7.438rem] rounded-[999px] border-2 border-primary-500 p-[1rem_1.5rem] text-[1.75rem] font-light leading-[2.118rem] tracking-[-0.01em] text-primary-500">
              Login
            </button>
          </div>
        );
      case "inquirySubmitted":
        return (
          <div className="flex-col-center-center">
            <div className="flex-col-center-center h-[7.063rem] w-[41.8rem] gap-[1.438rem]">
              <h1 className="text-[2.25rem] font-bold leading-[3.375rem] tracking-[-0.01em]">
                문의를 보냈어요!
              </h1>
              <p className="text-[1.5rem] font-medium leading-[2.25rem] tracking-[-0.011em] text-[#8F8F8F]">
                문의를 성공적으로 전송했어요. 빠른 시일 내에 답변해드릴게요.
              </p>
            </div>
            <Button
              className="mt-14 h-14 w-[20.938rem] gap-[0.625rem] text-[1.25rem] tracking-[-0.011em]"
              onClick={() => {
                router.push("/");
                onClose();
              }}
            >
              홈으로 가기
            </Button>
          </div>
        );
      default:
        return children;
    }
  };

  return (
    <div
      className={clsx("fixed inset-0 z-50 flex items-center justify-center", {
        "bg-black bg-opacity-50": ["processing", "inquirySubmitted"].includes(
          variant || "",
        ),
        "bg-transparent": !["processing", "inquirySubmitted"].includes(
          variant || "",
        ),
      })}
    >
      <div
        className={clsx(modalVariants({ variant, size }), className)}
        {...props}
      >
        {renderContent()}
      </div>
    </div>
  );
}
