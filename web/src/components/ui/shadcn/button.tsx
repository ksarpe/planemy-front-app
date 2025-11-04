import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center active:scale-95 transition-transform duration-200 gap-2 whitespace-nowrap rounded-2xl text-sm font-medium shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-bg text-text hover:bg-bg-muted-light",
        primary: "bg-primary text-white hover:bg-primary-light",
        success: "bg-success text-white hover:bg-green-600",
        delete: "bg-negative text-white hover:bg-red-800",
        destructive: "bg-destructive text-white",
        outline: "bg-bg text-text border-2 border-bg-muted-light",
        secondary: "bg-bg-alt text-text",
        ghost: "bg-transparent text-text hover:bg-bg-muted-light/30",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-8 rounded-xl gap-1.5 px-3.5 has-[>svg]:px-3 text-xs",
        lg: "h-12 rounded-2xl px-7 has-[>svg]:px-5 text-base",
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
