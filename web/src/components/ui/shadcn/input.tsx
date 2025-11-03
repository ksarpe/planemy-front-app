import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      autoFocus={props.autoFocus}
      className={cn(
        "text-text w-full rounded-2xl px-3 py-2 text-sm shadow-[10px_6px_12px] hover:shadow-[6px_4px_8px] shadow-button-active-shadow focus:not:shadow-button-active-shadow focus:shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)]\
        aria-invalid:ring-destructive/20 aria-invalid:border-destructive outline-0",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

// background: linear-gradient(145deg, #cacaca, #f0f0f0);
// box-shadow:  12px 12px 25px #949494,
//              -12px -12px 25px #ffffff;
