import * as React from "react";

import { cn } from "@/lib/shadcn/utils";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label: string;
  placeholder: string;
}

function PasswordInput({ label, className, placeholder, ...props }: PasswordInputProps) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="">
          <span className="font-semibold text-text-muted text-sm">{label}</span>
        </label>
      )}

      {/* Input with toggle button */}
      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          className={cn(
            "text-text text-sm p-4 pr-12 w-full rounded-2xl outline-0 border border-bg-muted-light hover:border-text-muted-more focus:border-primary focus:bg-primary/10 transition-colors",
          )}
          {...props}
        />

        {/* Toggle visibility button */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted hover:text-text transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export { PasswordInput };
