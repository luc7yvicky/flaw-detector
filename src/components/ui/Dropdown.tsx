"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconCaretDown, IconCheck } from "./Icons";

export type DropdownProps = React.HTMLAttributes<HTMLDivElement> & {
  type: "type" | "sort";
};

export type Option = { id: string; name: string; value: string };

const typeOptions: Option[] = [
  { id: "0", name: "폴더순", value: "folder" },
  { id: "1", name: "파일순", value: "file" },
];

const sortOptions: Option[] = [
  { id: "0", name: "최신순", value: "latest" },
  { id: "1", name: "오래된순", value: "oldest" },
  { id: "2", name: "이름순", value: "name" },
];

const getOptions = (type: string): Option[] => {
  switch (type) {
    case "type":
      return typeOptions;
    case "sort":
      return sortOptions;
    default:
      return [];
  }
};

function DropdownMenu({
  options,
  selectedIndex,
  setSelectedIndex,
  setIsOpen,
}: {
  options: Option[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onClickOption = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(false); // close dropdown
  };

  return (
    <ul
      className={cn(
        "absolute top-[3.25rem] z-10 w-full overflow-hidden rounded-lg bg-white shadow-[0_0.125rem_1rem_0_rgba(0,0,0,0.25)]",
      )}
      role="menu"
    >
      {options &&
        options.map(({ id, name, value }, index) => (
          <li
            key={id}
            className={cn(
              "flex-center-center h-[2.438rem] w-full bg-white px-[0.6rem] py-[0.469rem] transition-all duration-300 first:rounded-t-lg last:rounded-b-lg",
              selectedIndex === index
                ? "cursor-default justify-between bg-purple-dark"
                : "hover:bg-purple-light",
              name.length > 3 && "px-[0.1rem]",
            )}
            onClick={() => onClickOption(index)}
            value={value}
            role="menuitem"
          >
            {selectedIndex === index && <IconCheck width={20} height={20} />}
            {name}
          </li>
        ))}
    </ul>
  );
}

export default function Dropdown({ type, className, ...props }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  return (
    <div
      className={cn(
        "relative flex w-[5.563rem] cursor-pointer flex-col",
        className,
      )}
      {...props}
    >
      <button
        className={cn(
          "inline-flex h-[2.75rem] w-full items-center justify-between rounded-lg border border-gray-default px-[0.625rem] py-[0.625rem] text-xl text-gray-dark outline-0",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{type === "type" ? "Type" : type === "sort" ? "Sort" : ""}</span>
        <IconCaretDown />
      </button>
      {isOpen && (
        <DropdownMenu
          options={getOptions(type)}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
