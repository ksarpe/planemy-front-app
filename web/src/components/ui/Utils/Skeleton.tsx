import { cn } from "@/lib/shadcn/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({ className, variant = "rectangular", width, height, animation = "pulse" }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-text-muted bg-[length:200%_100%]",
    none: "",
  };

  return (
    <div
      className={cn("bg-bg-muted-light", variantClasses[variant], animationClasses[animation], className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

// Preset skeleton components for common use cases
export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" className={i === lines - 1 ? "w-4/5" : "w-full"} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("border border-border rounded-lg p-4 space-y-3", className)}>
      <div className="flex items-start space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton variant="rounded" height={36} className={cn("w-24", className)} />;
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return <Skeleton variant="circular" width={size} height={size} className={className} />;
}

export function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton variant="rounded" height={24} className={cn("w-16", className)} />;
}

export function SkeletonInput({ className }: { className?: string }) {
  return <Skeleton variant="rounded" height={36} className={cn("w-full", className)} />;
}
