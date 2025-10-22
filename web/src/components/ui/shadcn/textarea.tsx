import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-more border-text-muted-more flex min-h-15 w-full rounded-lg border border-b-input bg-transparent px-3 py-2 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-b-destructive",
        "hover:border-white",
        className,
      )}
      {...props}
    />
  );
}
Textarea.displayName = "Textarea";

export { Textarea };
