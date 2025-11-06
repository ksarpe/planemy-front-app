import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center active:scale-95 transition-transform duration-200 gap-2 whitespace-nowrap rounded-2xl text-sm font-medium shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-bg text-text hover:bg-bg-muted-light", //DEFAULT
        primary: "bg-primary text-white hover:bg-primary-light",
        success: "bg-success text-white hover:bg-green-600",
        delete: "bg-negative text-white hover:bg-red-800",
        ghost: "text-text hover:bg-bg",
      },
      size: {
        default: "p-2 text-xs", //DEFAULT
        sm: "h-8 text-xs",
        lg: "p-4",
        icon: "size-10",
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
