import * as React from "react";

import { cn } from "@/lib/shadcn/utils";

export function Textarea({ className, onChange, ...props }: React.ComponentProps<"textarea">) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const textAfterCursor = textarea.value.substring(cursorPosition);

    // Check if user just typed "- " at the start of a line
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // If the current line ends with "- " (dash + space) at the start of the line
    if (currentLine === "- ") {
      // Replace "- " with "  • " (2 spaces + bullet for indentation)
      const linesBeforeCurrent = lines.slice(0, -1);
      const newTextBeforeCursor = [...linesBeforeCurrent, "  • "].join("\n");
      const newValue = newTextBeforeCursor + textAfterCursor;

      // Update textarea value
      textarea.value = newValue;

      // Restore cursor position (adjusted for the replaced character)
      const newCursorPosition = newTextBeforeCursor.length;
      textarea.selectionStart = newCursorPosition;
      textarea.selectionEnd = newCursorPosition;

      // Create synthetic event with updated value
      const syntheticEvent = {
        ...e,
        target: textarea,
        currentTarget: textarea,
      };

      // Call original onChange if provided
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
      return;
    }

    // Call original onChange for all other cases
    onChange?.(e);
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        " text-text flex min-h-15 w-full rounded-2xl shadow-[10px_6px_12px] hover:shadow-[6px_4px_8px] shadow-button-active-shadow focus:not:shadow-button-active-shadow focus:shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)] bg-transparent px-3 py-2 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-b-destructive",
        "hover:border-text-muted",
        className,
      )}
      onChange={handleChange}
      {...props}
    />
  );
}
