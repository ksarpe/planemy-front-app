import * as React from "react";

import { cn } from "@/lib/shadcn/utils";
import { useId } from "react";

interface InputProps extends React.ComponentProps<"input"> {
  label: string;
}

function Input({ label, className, type, ...props }: InputProps) {
  const id = useId();
  return (
    <div className={cn("rounded-2xl py-1 px-2 border hover:border-text-muted-more border-bg-muted-light", className)}>
      <label htmlFor={id} className="text-xs text-text-muted-more font-medium">
        {label}
      </label>
      <input value={props.value} type={type} className={cn("text-text w-full outline-0")} {...props} />
    </div>
  );
}

export { Input };
