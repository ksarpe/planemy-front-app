import { Textarea } from "@/components/ui/shadcn/textarea";
import { ComponentProps } from "react";

interface FloatingLabelTextareaProps extends ComponentProps<typeof Textarea> {
  label: string;
  id: string;
  labelBg?: "bg-bg" | "bg-bg-alt"; // Background color for label span
}

export function FloatingLabelTextarea({ label, id, labelBg = "bg-bg", ...textareaProps }: FloatingLabelTextareaProps) {
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-text-muted/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-text has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-text-muted">
        <span className={`inline-flex ${labelBg} px-2`}>{label}</span>
      </label>
      <Textarea id={id} placeholder=" " {...textareaProps} />
    </div>
  );
}
