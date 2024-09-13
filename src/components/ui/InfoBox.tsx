import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const colorVariants = {
  primary: "text-primary-500",
  red: "text-accent-red",
  gray: "text-gray-dark",
  "gray-light": "text-gray-default",
};

const infoBoxVariants = cva(
  "flex-col-start-center relative h-fit w-full gap-y-[0.625rem] rounded-xl p-5",
  {
    variants: {
      variant: {
        primary: "bg-purple-light",
        red: "bg-red-light",
        gray: "bg-bggray-light",
      },
    },
    defaultVariants: {
      variant: "red",
    },
  },
);

const infoBoxTitleVariants = cva("text-2xl font-semibold leading-[1.4]", {
  variants: {
    color: colorVariants,
  },
  defaultVariants: {
    color: "red",
  },
});

const infoBoxDescriptionVariants = cva(
  "text-lg font-medium leading=[1.575rem] tracking-[1.5%]",
  {
    variants: {
      color: colorVariants,
    },
    defaultVariants: {
      color: "gray",
    },
  },
);

export type InfoBoxProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof infoBoxVariants>;

export type InfoBoxTextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof infoBoxTitleVariants> &
  VariantProps<typeof infoBoxDescriptionVariants>;

function InfoBox({ variant, className, children, ...props }: InfoBoxProps) {
  return (
    <div className={cn(infoBoxVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

function InfoBoxHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex items-center gap-x-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function InfoBoxTitle({
  color,
  className,
  children,
  ...props
}: InfoBoxTextProps) {
  return (
    <p
      className={cn(infoBoxTitleVariants({ color }), className)}
      {...props}
      role="title"
    >
      {children}
    </p>
  );
}

function InfoBoxDescriptionList({
  color,
  className,
  children,
  ...props
}: InfoBoxTextProps) {
  return (
    <ul
      className={cn(
        infoBoxDescriptionVariants({ color }),
        "ml-3 list-disc marker:text-xs",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

function InfoBoxDescriptionListItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn("ml-4", className)}
      {...props}
      role="vulnerability issue description"
    >
      {children}
    </li>
  );
}

function InfoBoxDescriptionText({
  color,
  className,
  children,
  ...props
}: InfoBoxTextProps) {
  return (
    <p
      className={cn(
        "flex flex-col",
        infoBoxDescriptionVariants({ color }),
        className,
      )}
      {...props}
      role="description"
    >
      {children}
    </p>
  );
}

export {
  InfoBox,
  InfoBoxHeader,
  InfoBoxTitle,
  InfoBoxDescriptionList,
  InfoBoxDescriptionListItem,
  InfoBoxDescriptionText,
};
