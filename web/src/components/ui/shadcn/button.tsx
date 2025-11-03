import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 shrink-0 \
  shadow-[4px_4px_8px_rgba(0,0,0,0.4)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.5)] active:shadow-[inset_2px_2px_7px] active:shadow-button-active-shadow \
",
  {
    variants: {
      variant: {
        default: "bg-bg-alt text-text cursor-pointer",
        default_light: "bg-bg-muted-light text-text cursor-pointer",
        primary: "bg-primary text-white cursor-pointer",
        success: "bg-success text-white cursor-pointer",
        delete: "bg-negative text-white cursor-pointer",
        destructive: "bg-destructive text-white cursor-pointer",
        outline: "bg-bg text-text cursor-pointer border-2 border-bg-muted-light",
        secondary: "bg-bg-alt text-text cursor-pointer",
        ghost: "bg-transparent text-text cursor-pointer hover:bg-bg-muted-light/30",
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
