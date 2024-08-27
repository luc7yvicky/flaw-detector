"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import { IconArrow } from "./Icons";
// import { IconCaretLeft } from "./Icons";

type TitleBarProps = {
  title: string;
  backPath?: string;
};

export default function TitleBar({ title, backPath }: TitleBarProps) {
  const router = useRouter();
  const onClickButton = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };
  return (
    <div className="flex-center-left mb-8 flex h-[4.875rem]">
      <Button
        shape="pill"
        variant="outlined"
        className="flex-center-center size-[4.875rem] border-[0.25rem]"
        onClick={onClickButton}
      >
        {/* <IconCaretLeft /> */}
        <IconArrow />
      </Button>
      <div className="flex-center-start ml-[1.5rem] flex size-full rounded-full border-[0.25rem] border-primary-500 px-[2rem] py-2 text-[2.5rem] text-primary-500">
        {title}
      </div>
    </div>
  );
}
// export default function TitleBar({ title, backPath }: TitleBarProps) {
//   return (
//     <div className="flex-center-left mb-11 flex">
//       <Button
//         shape="pill"
//         variant="outlined"
//         className="flex-center-center size-20"
//       >
//         <IconArrow />
//       </Button>
//       <h1 className="ml-[1.825rem] text-[2.5rem] font-bold text-primary-500">
//         {title}
//       </h1>
//     </div>
//   );
// }
