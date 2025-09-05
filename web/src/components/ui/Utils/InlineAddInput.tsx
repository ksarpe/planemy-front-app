// src/components/ui/InlineAddInput.tsx
import { useEffect, useRef } from "react";
import type { InlineAddInputProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";

export default function InlineAddInput({
  onSubmit,
  onCancel,
  placeholder = "Enter value...",
  classNames = "",
}: InlineAddInputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const value = inputRef.current?.value.trim();
      if (value) {
        onSubmit(value);
      } else {
        onSubmit("");
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <div ref={wrapperRef} className={`flex w-full justify-between items-center  ${classNames}`}>
      <input
        ref={inputRef}
        autoFocus
        type="text"
        className="flex-1 mr-2 bg-transparent outline-none text-base"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        maxLength={25}
      />
      <button
        onClick={() => {
          const value = inputRef.current?.value.trim();
          if (value) {
            onSubmit(value);
          } else {
            onSubmit("");
          }
        }}
        className="text-xl font-bold text-green-500 hover:text-green-400 cursor-pointer mr-1"
        title="Submit">
        ✓
      </button>
      <button
        onClick={onCancel}
        className="text-base font-bold text-gray-400 hover:text-red-500 cursor-pointer"
        title="Cancel">
        ❌
      </button>
    </div>
  );
}
