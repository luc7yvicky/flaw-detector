import FileTreeItemDemo from "@/components/analyze/FileTree/FileTreeItemDemo";
import { FileTreeItemDemoProps } from "@/types/file";
import dynamic from "next/dynamic";

const IconList = dynamic(() => import("@/components/ui/icons/IconList"));
const IconMultiSelect = dynamic(
  () => import("@/components/ui/icons/IconMultiSelect"),
);

export const DEMO_FILE_TREE_ITEMS: Array<
  FileTreeItemDemoProps & { name: string }
> = [
  { type: 0, name: "public", depth: 0 },
  { type: 0, name: "src", depth: 0, isOpenDir: true },
  { type: 0, name: "app", depth: 1, isOpenDir: true },
  { type: 0, name: "(blog)", depth: 2, isOpenDir: true },
  {
    type: 1,
    name: "layout.tsx",
    depth: 3,
    isChecked: true,
  },
  { type: 1, name: "page.tsx", depth: 3, isBookmarked: true },
  { type: 0, name: "api", depth: 2 },
  { type: 1, name: "globals.css", depth: 3, isHovered: true },
  { type: 1, name: "layout.tsx", depth: 3, isSuccessful: true },
  { type: 1, name: "loading.tsx", depth: 3 },
];

export default function DemoFileExplorer() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line-light">
      <div className="flex items-center rounded-t-[0.513rem] border-b border-line-light bg-purple-light px-[0.855rem] py-5 text-xl text-black">
        <div className="flex w-full items-center justify-between">
          <span>Files</span>
          <div className="flex gap-3.5">
            <IconMultiSelect width={20} />
            <IconList width={20} />
          </div>
        </div>
      </div>
      <ul className="max-h-[40rem] overflow-x-hidden overflow-y-scroll text-gray-dark scrollbar-hide">
        {DEMO_FILE_TREE_ITEMS.map((item, index) => (
          <FileTreeItemDemo key={index} {...item}>
            {item.name}
          </FileTreeItemDemo>
        ))}
      </ul>
    </div>
  );
}
