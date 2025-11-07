import * as React from "react";

import { cn } from "@/lib/shadcn/utils";
import { useId } from "react";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  placeholder: string;
}

function Input({ label, className, type, placeholder, ...props }: InputProps) {
  const id = useId();
  return (
    <div className={className}>
      {/* If label is specified */}
      {label && (
        <label htmlFor={id} className="">
          <span className="font-semibold text-text-muted text-sm">{label}</span>
        </label>
      )}
      <input
        placeholder={placeholder}
        value={props.value}
        type={type}
        className={cn(
          "text-text text-sm p-4 w-full rounded-2xl outline-0 border border-bg-muted-light hover:border-text-muted-more focus:border-primary focus:bg-primary/10",
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
