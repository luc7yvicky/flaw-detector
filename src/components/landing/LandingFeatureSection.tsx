"use client";
import { cn } from "@/lib/utils";
import { IconBug } from "../ui/Icons";

export default function LandingFeatureSection() {
  return (
    <section className="flex-end-center relative max-h-screen min-h-dvh w-full bg-primary-50 bg-cover bg-center text-primary-500">
      <article className="absolute left-[12rem] h-[29.5rem] w-[41rem]">
        <h2 className="flex-col-start-center w-full space-y-3 text-[5rem] font-bold leading-[6.051rem] tracking-[-0.01em]">
          <span>쉽고 편하게</span>
          <span>취약점을 발견하다</span>
        </h2>
        <p className="mt-[3.75rem] flex flex-col space-y-3 text-[2rem] font-bold leading-[2.421rem] tracking-[-0.01em] text-gray-dark">
          <span>코드보안</span>
          <span>어떻게 관리하시나요?</span>
        </p>
        <p className="flex-col-start-center mb-2 mt-7 space-y-2 text-[1.25rem] leading-[1.512rem] tracking-[-0.01em] text-gray-default">
          <span>플로디텍터는 안전한 소프트웨어 개발을 위한 필수 도구로,</span>
          <span>코드의 보안 취약점을 사전에 수정함으로써</span>
          <span>개발자들에게 편의와 안전한 개발 환경을 제공합니다.</span>
        </p>
      </article>

      <div className="absolute right-[18.337rem] z-10 h-[23.875rem] w-[23.788rem] gap-[0.625rem] rounded-lg bg-white p-[5.813rem_5.938rem] shadow-[0rem_3.75rem_3.75rem_-1.5rem_#6100FF40]">
        <IconBug />
      </div>
      <SquareBackground className="animate-roll-around-y" />
    </section>
  );
}

export function SquareBackground({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      width="532"
      height="100vh"
      viewBox="0 0 400 1022"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-primary-500", "animate-roll-around-y", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.927734 8C0.927734 3.58172 4.50945 0 8.92773 0H193.504C197.923 0 201.504 3.58172 201.504 8V192.804C201.504 197.222 197.923 200.804 193.504 200.804H8.92773C4.50946 200.804 0.927734 197.222 0.927734 192.804V8ZM9.92563 0.999022C5.50735 0.999022 1.92563 4.58073 1.92563 8.99901V191.804C1.92563 196.223 5.50734 199.804 9.92562 199.804H192.506C196.925 199.804 200.506 196.223 200.506 191.804V8.99902C200.506 4.58074 196.925 0.999022 192.506 0.999022H9.92563Z"
        fill="currentColor"
      />
      {/* <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.07087 237.981C2.95048 234.853 2.95048 229.782 6.07087 226.654L136.6 95.8071C139.72 92.6791 144.779 92.6791 147.9 95.8071L278.428 226.654C281.549 229.782 281.549 234.853 278.428 237.981L147.9 368.828C144.779 371.956 139.72 371.956 136.6 368.828L6.07087 237.981ZM7.48118 226.654C4.36079 229.782 4.3608 234.853 7.48119 237.981L136.6 367.414C139.72 370.542 144.779 370.542 147.9 367.414L277.018 237.981C280.138 234.853 280.138 229.782 277.018 226.654L147.9 97.2208C144.779 94.0928 139.72 94.0928 136.6 97.2208L7.48118 226.654Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M147.479 949.406C144.358 952.534 139.299 952.534 136.179 949.406L5.64993 818.559C2.52955 815.431 2.52954 810.36 5.64993 807.232L136.179 676.385C139.299 673.257 144.358 673.257 147.479 676.385L278.007 807.232C281.128 810.36 281.128 815.431 278.007 818.559L147.479 949.406ZM136.179 947.992C139.299 951.12 144.358 951.12 147.479 947.992L276.597 818.559C279.717 815.431 279.717 810.36 276.597 807.232L147.479 677.799C144.358 674.671 139.299 674.671 136.179 677.799L7.06025 807.232C3.93986 810.36 3.93986 815.431 7.06026 818.559L136.179 947.992Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M532.504 1014C532.504 1018.42 528.922 1022 524.504 1022H339.928C335.509 1022 331.928 1018.42 331.928 1014V829.196C331.928 824.778 335.509 821.196 339.928 821.196H524.504C528.922 821.196 532.504 824.778 532.504 829.196V1014ZM523.506 1021C527.925 1021 531.506 1017.42 531.506 1013V830.196C531.506 825.777 527.925 822.196 523.506 822.196H340.925C336.507 822.196 332.925 825.777 332.925 830.196V1013C332.925 1017.42 336.507 1021 340.925 1021H523.506Z"
        fill="currentColor"
      /> */}
    </svg>
  );
}
