import { useRouter } from "next/navigation";
import Button from "./Button";
import { IconArrow } from "./Icons";

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
    <div className="flex-center-left mb-8 flex">
      <Button
        shape="pill"
        variant="outlined"
        className="flex-center-center size-12"
        onClick={onClickButton}
      >
        <IconArrow />
      </Button>
      <h1 className="ml-[1.5rem] text-[2rem] font-bold text-primary-500">
        {title}
      </h1>
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
