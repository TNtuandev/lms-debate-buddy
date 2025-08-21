import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "md:px-4 cursor-pointer bg-primary-main shadow-xs hover:bg-primary-main/90",
        destructive:
          "md:px-4 cursor-pointer bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "md:px-4 cursor-pointer border-[#FFA10A] text-[#FFA10A] border border-disabled bg-background shadow-xs hover:bg-disabled/10 hover:bg-[#FFA10A]/20",
        secondary:
          "md:px-4 cursor-pointer bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70",
        ghost:
          "md:px-4 cursor-pointer hover:bg-zinc-200 text-primary hover:text-primary/80",
        link: "cursor-pointer text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 has-[>svg]:px-4 md:has-[>svg]:px-2.5 lg:has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-4 md:has-[>svg]:px-2.5 lg:has-[>svg]:px-4",
        lg: "h-10 rounded-md lg:px-6 has-[>svg]:px-4 md:has-[>svg]:px-2.5 lg:has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
