"use client";

import { useEffect, useState } from "react";
import { Floating } from "@/components/ui/Floating";

export default function LandingTopFloating() {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const SCROLL_THRESHOLD = 355;

  useEffect(() => {
    const updateFloatingVisible = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsFloatingVisible(true);
      } else {
        setIsFloatingVisible(false);
      }
    };

    window.addEventListener("scroll", updateFloatingVisible);

    return () => {
      window.removeEventListener("scroll", updateFloatingVisible);
    };
  }, []);

  return (
    <div className="width-[4.75rem] absolute bottom-36 right-32">
      {isFloatingVisible && (
        <Floating
          variant="top"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fixed bottom-36"
        />
      )}
    </div>
  );
}
