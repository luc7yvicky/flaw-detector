import { VariantProps } from "class-variance-authority";

export type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    children?: React.ReactNode;
  };

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  hasMenu?: boolean;
};

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "big" | "small" | "xsmall" | "default";
  weight?: "bold" | "default" | "normal";
  color?: string;
  isSingleLine?: boolean;
};

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardContentVariants>;

export type ImageCardStyles = {
  cardSize: "main" | "sub";
  imageSrc: string;
  titleSize: "big" | "xsmall";
  subtitleSize: "big" | "base";
  titleWrapperWidth: "w-[27.5rem]" | "w-[8.5rem]";
};
