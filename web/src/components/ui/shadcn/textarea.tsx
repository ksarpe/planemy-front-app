import * as React from "react";

import { cn } from "@/lib/shadcn/utils";
import { useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  const id = useId();

  return (
    <div className={cn("bg-bg-alt rounded-2xl py-1 px-2 border hover:border-text-muted-more border-bg-muted-light", className)}>
      <label htmlFor={id} className="text-xs text-text-muted-more font-medium">
        {label}
      </label>
      <textarea
        value={props.value}
        autoFocus={props.autoFocus}
        className={cn("text-text w-full outline-0")}
        {...props}
      />
    </div>
  );
}
