"use client";

import { motion } from "framer-motion";
import ServiceCard, { ServiceVariants } from "./ServiceCard";

export default function LandingServiceSection() {
  const cardVariants: Array<ServiceVariants["variant"]> = [
    "security",
    "critical",
    "realtime",
    "privacy",
    "efficiency",
    "quick",
  ];

  return (
    <section className="snap-box flex min-h-[calc(100dvh-8.5rem)] w-full flex-col gap-y-[7.5rem] bg-primary-500">
      <article className="pt-[8.898rem]">
        <h3 className="flex-col-center-center space-y-3 text-6xl font-bold leading-[4.538rem] -tracking-[0.011em] text-white">
          <div className="flex flex-col space-y-3 sm:inline">
            <span>안전과 보호를 </span>
            <span>우선으로 하는</span>
          </div>
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
            .fill(cardVariants)
            .flat()
            .map((card, index) => (
              <ServiceCard
                key={index}
                variant={card}
                className="w-[339px] flex-shrink-0"
              />
            ))}
        </motion.div>
      </article>
    </section>
  );
}
