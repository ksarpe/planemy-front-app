import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center active:scale-95 transition-transform duration-200 gap-2 whitespace-nowrap rounded-2xl text-sm font-medium shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-bg-secondary text-text hover:bg-bg-muted-light", //DEFAULT
        primary: "bg-primary text-white hover:bg-primary-light",
        primary_reverse: "bg-bg-primary border border-primary text-primary hover:bg-primary/10",
        success: "bg-success text-white hover:bg-green-600",
        delete: "bg-negative text-white hover:bg-red-800",
        ghost: "text-text hover:bg-bg",
        link: "text-primary font-normal hover:text-primary-light",
      },
      size: {
        default: "text-sm p-2", //DEFAULT
        sm: "h-8 text-xs",
        lg: "p-4",
        icon: "p-2",
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

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
