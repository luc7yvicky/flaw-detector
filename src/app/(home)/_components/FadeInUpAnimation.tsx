import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
// import { memo } from "react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: "1.5rem" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeInOut" },
  },
};

type FadeInUpAnimationProps = {
  as?: keyof JSX.IntrinsicElements;
  texts: string[];
  className?: string;
};

const FadeInUpAnimation = ({
  as: element = "h2",
  texts,
  className,
  ...props
}: FadeInUpAnimationProps) => {
  const MotionComponent = motion.create(element);

  return (
    <MotionComponent
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      {...props}
    >
      {texts.map((text, index) => (
        <motion.span key={index} variants={fadeUpVariants}>
          {text}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export default FadeInUpAnimation;
