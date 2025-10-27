import { mergeProps } from "@base-ui-components/react/merge-props";
import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/shadcn/utils";

const badgeVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-1 rounded-sm border font-medium whitespace-nowrap transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3 [button,a&]:cursor-pointer [button,a&]:pointer-coarse:after:absolute [button,a&]:pointer-coarse:after:size-full [button,a&]:pointer-coarse:after:min-h-11 [button,a&]:pointer-coarse:after:min-w-11",
  {
    variants: {
      variant: {
        blue: "bg-blue-500 text-white border-blue-500",
        green: "bg-green-500 text-white border-green-500",
        yellow: "bg-yellow-500 text-black border-yellow-500",
        red: "bg-red-500 text-white border-red-500",
        purple: "bg-purple-500 text-white border-purple-500",
      },
      size: {
        default: "px-[calc(--spacing(1)-1px)] text-xs",
        sm: "rounded-[calc(var(--radius-sm)-2px)] px-[calc(--spacing(1)-1px)] text-[.625rem]",
        lg: "px-[calc(--spacing(1.5)-1px)] text-sm",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "default",
    },
  },
);

interface BadgeProps extends useRender.ComponentProps<"span"> {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
}

function Badge({ className, variant, size, render, ...props }: BadgeProps) {
  const defaultProps = {
    "data-slot": "badge",
    className: cn(badgeVariants({ variant, size, className })),
  };

  return useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(defaultProps, props),
  });
}

export { Badge };
