"use client";

import { Floating } from "@/components/ui/Floating";
import { useEffect, useState } from "react";

export default function LandingTopFloating() {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("#hero");

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsFloatingVisible(false);
        } else {
          setIsFloatingVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (hero) {
      observer.observe(hero);
    }

    return () => {
      if (hero) {
        observer.unobserve(hero);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-12 right-14 z-20 size-[4.75rem] md:bottom-36 md:right-32">
      {isFloatingVisible && (
        <Floating
          variant="top"
          onClick={() => {
            const hero = document.querySelector("#hero");
            hero?.scrollIntoView({ behavior: "smooth" });
          }}
          className="fixed bottom-12 md:bottom-36"
        />
      )}
    </div>
  );
}
