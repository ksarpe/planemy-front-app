import type { ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export function Tooltip({ content, children, position = "top", className = "", delay = 0 }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-bg-alt",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-bg-alt",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-bg-alt",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-bg-alt",
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={`
          absolute z-50 ${positionClasses[position]}
          px-2 py-1 text-xs rounded bg-bg-alt text-text
          opacity-0 group-hover:opacity-100 
          transition-opacity ${delay > 0 ? `delay-${delay}` : ""}
          pointer-events-none whitespace-nowrap
          shadow-lg border border-bg-muted-light
          ${className}
        `}>
        {content}
        {/* Arrow */}
        <div
          className={`
            absolute w-0 h-0 border-4 ${arrowClasses[position]}
          `}
        />
      </div>
    </div>
  );
}
