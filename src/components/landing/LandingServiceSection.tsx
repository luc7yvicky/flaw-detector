"use client";

import ServiceCard from "./ServiceCard";
import { motion } from "framer-motion";

export default function LandingServiceSection() {
  const cards = [
    { variant: "security" },
    { variant: "critical" },
    { variant: "realtime" },
    { variant: "privacy" },
    { variant: "efficiency" },
    { variant: "quick" },
  ];

  return (
    <>
      {/* max-h-screen */}
      <section className="flex min-h-dvh w-full flex-col gap-y-[7.5rem] bg-primary-500">
        <article className="pt-[8.898rem]">
          <h3 className="flex-col-center-center space-y-3 text-[3.75rem] font-bold leading-[4.538rem] -tracking-[0.011em] text-white">
            <span>안전과 보호를 우선으로 하는</span>
            <span>프로세스를 제공합니다.</span>
          </h3>
        </article>
        <article className="relative w-full overflow-x-hidden">
          <motion.div
            className="flex min-h-[35rem] w-auto flex-nowrap gap-x-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            }}
          >
            {Array(2)
              .fill(cards)
              .flat()
              .map((card, index) => (
                <ServiceCard
                  key={index}
                  variant={card.variant}
                  className="w-[339px] flex-shrink-0"
                />
              ))}
          </motion.div>
        </article>
      </section>
    </>
  );
}
