"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useRef, useState } from "react";
import { IconCaretDown, IconCheck } from "./Icons";
import useOutsideClick from "@/hooks/useOutsideClick";

export type DropdownProps = React.HTMLAttributes<HTMLDivElement> & {
  type: "type" | "sort" | "label";
  onSelectFilter: React.Dispatch<React.SetStateAction<string>>;
};

type DropdownMenuProps = {
  options: Option[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: React.Dispatch<React.SetStateAction<string>>;
};

export type Option = { id: string; name: string; value: string };

const typeOptions: Option[] = [
  { id: "0", name: "검사완료", value: "done" },
  { id: "1", name: "검사중", value: "onProgress" },
  { id: "2", name: "미검사", value: "notChecked" },
];

const labelOptions: Option[] = [
  { id: "0", name: "보고서", value: "취약성 보고서" },
  { id: "1", name: "알림", value: "취약성 알림" },
  { id: "2", name: "기타", value: "기타" },
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
    case "label":
      return labelOptions;
    case "sort":
      return sortOptions;
    default:
      return [];
  }
};

const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
  ({ options, selectedIndex, setSelectedIndex, setIsOpen, onChange }, ref) => {
    const onClickOption = (index: number) => {
      const newIndex = index === selectedIndex ? -1 : index;
      setSelectedIndex(newIndex);
      setIsOpen(false); // close dropdown
      onChange(newIndex === -1 ? "" : options[index].value);
    };

    return (
      <ul
        className={cn(
          "absolute top-[3.25rem] z-10 w-full overflow-hidden rounded-lg bg-white shadow-[0_0.125rem_1rem_0_rgba(0,0,0,0.25)]",
        )}
        role="menu"
        aria-label="menu"
        ref={ref}
      >
        {options?.map(({ id, name, value }, index) => (
          <li
            key={id}
            className={cn(
              "flex-center-center h-[2.438rem] w-full bg-white px-[0.6rem] py-[0.469rem] transition-all duration-300 first:rounded-t-lg last:rounded-b-lg",
              selectedIndex === index
                ? "cursor-default gap-x-2 bg-primary-50"
                : "hover:bg-purple-light",
              name.length > 3 && "px-[0.1rem]",
            )}
            onClick={() => onClickOption(index)}
            value={value}
            role="menu-item"
            aria-label="menu item"
          >
            {selectedIndex === index && <IconCheck width={13} height={13} />}
            {name}
          </li>
        ))}
      </ul>
    );
  },
);
DropdownMenu.displayName = "DropdownMenu";

export default function Dropdown({
  type,
  onSelectFilter,
  className,
  ...props
}: DropdownProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const selectedOptionName = getOptions(type).find(
    (option) => option.id === selectedIndex.toString(),
  )?.name;

  useOutsideClick([menuRef, buttonRef], () => setIsOpen(false));

  return (
    <div
      className={cn(
        "relative flex w-[6rem] min-w-fit cursor-pointer flex-col",
        className,
      )}
      {...props}
    >
      <button
        className={cn(
          "flex-center-center h-[2.75rem] w-full rounded-lg border border-gray-default px-[0.625rem] py-[0.625rem] text-xl text-gray-dark outline-0 hover:bg-slate-50",
          !selectedOptionName
            ? "gap-x-2"
            : "bg-purple-light font-bold shadow-[0_0.833rem_1.667rem_0_rgba(150,150,150,0.15)]",
        )}
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
      >
        <span>{selectedOptionName || (type === "sort" ? "Sort" : "Type")}</span>
        {!selectedOptionName && <IconCaretDown width={12} height={6} />}
      </button>
      {isOpen && (
        <DropdownMenu
          options={getOptions(type)}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          setIsOpen={setIsOpen}
          onChange={onSelectFilter}
          ref={menuRef}
        />
      )}
    </div>
  );
}
