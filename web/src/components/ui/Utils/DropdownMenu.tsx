// src/components/ui/DropdownMenu.tsx
import { useEffect, useRef } from "react";
import type { DropdownMenuProps } from "@/data/Utils/Components/UtilComponentInterfaces";

export default function DropdownMenu({ isOpen, onClose, children, className = "" }: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute right-0 z-50 w-34 rounded-xl border border-bg-hover bg-white  shadow-lg px-1 text-center ${className}`}>
      {children}
    </div>
  );
}
