import * as React from "react";

import { cn } from "@/lib/shadcn/utils";
import { useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder: string;
}

export function Textarea({ label, className, placeholder, ...props }: TextareaProps) {
  const id = useId();

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="">
          <span className="font-semibold text-text-muted text-sm">{label}</span>
        </label>
      )}
      <textarea
        value={props.value}
        placeholder={placeholder}
        autoFocus={props.autoFocus}
        className={cn(
          "text-text text-sm p-4 w-full rounded-2xl outline-0 border border-bg-muted-light hover:border-text-muted focus:border-primary focus:bg-primary/10",
        )}
        {...props}
      />
    </div>
  );
}
