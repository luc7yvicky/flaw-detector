import React, { useCallback } from 'react';
import { cn } from "@/lib/utils";
import { useFileSelectionStore } from "@/stores/useFileSelectionStore";

interface CheckboxProps {
  path: string;
  name: string;
  isImage: boolean;
  isCheckboxShow: boolean;
}
function Checkbox({ 
  path, 
  name, 
  isImage, 
  isCheckboxShow 
}: CheckboxProps) {
  const isFileSelected = useFileSelectionStore(
    useCallback((state) => state.isFileSelected(path), [path])
  );
  const toggleFileSelection = useFileSelectionStore((state) => state.toggleFileSelection);

  const handleCheckboxChange = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isImage) {
      toggleFileSelection(path, name);
    }
  }, [isImage, toggleFileSelection, path, name]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        isCheckboxShow ? "size-7" : "ml-4 h-7 w-0",
      )}
      onClick={handleCheckboxChange}
    >
      <input
        type="checkbox"
        checked={isFileSelected}
        onChange={() => {}}
        disabled={isImage}
        className={cn(
          "size-4 accent-primary-500",
          isImage && "cursor-not-allowed opacity-50",
          isCheckboxShow ? "block" : "hidden",
        )}
      />
      <div className="absolute inset-0" />
    </div>
  );
}

export default React.memo(Checkbox);