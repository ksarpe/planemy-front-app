import { Input } from "@/components/ui/shadcn/input";
import { ComponentProps } from "react";

interface FloatingLabelInputProps extends ComponentProps<typeof Input> {
  label: string;
  id: string;
  labelBg?: "bg-bg" | "bg-bg-alt"; // Background color for label span
}

export function FloatingLabelInput({ label, id, labelBg = "bg-bg", ...inputProps }: FloatingLabelInputProps) {
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="cursor-text absolute top-1/2 -translate-y-1/2 px-1 text-sm text-text-muted/70 transition-all group-focus-within:top-0 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-text has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-text">
        <span className={`inline-flex ${labelBg} px-2`}>{label}</span>
      </label>
      <Input id={id} placeholder="" {...inputProps} />
    </div>
  );
}
