"use client";

import { useState } from "react";
import IconFilledShare from "@/components/ui/icons/IconFilledShare";
import IconShare from "@/components/ui/icons/IconShare";

export default function ShareButton({ postId }: { postId: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const getPostUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/vuldb/items/${postId}`;
    }
    return "";
  };

  const onClickShareButton = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const { toast } = await import("sonner");

    const postUrl = getPostUrl();

    if (!postUrl) {
      toast("🚨 링크 복사에 실패했습니다");
      console.error("Post URL을 생성할 수 없습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(postUrl);
      toast("✅ 링크가 복사되었습니다");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 500);
    } catch (error) {
      toast("🚨 링크 복사에 실패했습니다");
      console.error("링크 복사 실패:", error);
    }
  };

  return (
    <button
      onClick={onClickShareButton}
      aria-label="링크 복사 버튼"
      className="p-1"
    >
      {!isCopied ? <IconShare /> : <IconFilledShare />}
    </button>
  );
}
