import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      autoFocus={props.autoFocus}
      className={cn(
        "border-text-muted-more text-text flex h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "hover:border-text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
