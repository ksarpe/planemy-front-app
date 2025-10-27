import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonText } from "./Skeleton";

// Calendar Event Skeleton
export function SkeletonCalendarEvent() {
  return (
    <div className="border border-border rounded-lg p-3 space-y-2 bg-bg-alt">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-32 h-5" />
        <SkeletonBadge />
      </div>
      <SkeletonText lines={2} />
      <div className="flex items-center space-x-2">
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton variant="text" className="w-24 h-3" />
      </div>
    </div>
  );
}

// Task Item Skeleton
export function SkeletonTaskItem() {
  return (
    <div className="flex items-start space-x-3 p-3 border-b border-border">
      <Skeleton variant="circular" width={20} height={20} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <div className="flex items-center space-x-2">
          <SkeletonBadge />
          <SkeletonBadge />
        </div>
      </div>
      <Skeleton variant="circular" width={24} height={24} />
    </div>
  );
}

// Label Card Skeleton
export function SkeletonLabelCard() {
  return (
    <div className="border border-border rounded-lg p-4 bg-bg-alt">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" className="w-24 h-5" />
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

// Shopping List Item Skeleton
export function SkeletonShoppingItem() {
  return (
    <div className="flex items-center space-x-3 p-3 border-b border-border">
      <Skeleton variant="circular" width={20} height={20} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-2/3 h-5" />
        <Skeleton variant="text" className="w-1/3 h-4" />
      </div>
      <Skeleton variant="text" className="w-16 h-5" />
    </div>
  );
}

// Payment Card Skeleton
export function SkeletonPaymentCard() {
  return (
    <div className="border border-border rounded-lg p-4 bg-bg-alt space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-32 h-6" />
        <SkeletonBadge />
      </div>
      <div className="flex items-center space-x-3">
        <SkeletonAvatar size={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <div className="flex justify-between pt-3 border-t border-border">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-24 h-6" />
      </div>
    </div>
  );
}

// Profile Header Skeleton
export function SkeletonProfileHeader() {
  return (
    <div className="flex items-center space-x-4 p-6 bg-bg-alt rounded-lg">
      <SkeletonAvatar size={80} />
      <div className="flex-1 space-y-3">
        <Skeleton variant="text" className="w-48 h-7" />
        <Skeleton variant="text" className="w-64 h-5" />
        <div className="flex space-x-2">
          <SkeletonBadge />
          <SkeletonBadge />
          <SkeletonBadge />
        </div>
      </div>
    </div>
  );
}

// List Skeleton (generic for multiple items)
export function SkeletonList({
  count = 3,
  ItemComponent = SkeletonTaskItem,
}: {
  count?: number;
  ItemComponent?: React.ComponentType;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <ItemComponent key={i} />
      ))}
    </div>
  );
}

// Grid Skeleton (generic for grid layouts)
export function SkeletonGrid({
  count = 6,
  ItemComponent = SkeletonLabelCard,
  columns = 3,
}: {
  count?: number;
  ItemComponent?: React.ComponentType;
  columns?: 2 | 3 | 4;
}) {
  const gridClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <ItemComponent key={i} />
      ))}
    </div>
  );
}

// Table Row Skeleton
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 p-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" className="flex-1" />
      ))}
    </div>
  );
}

// Form Skeleton
export function SkeletonForm({ fields = 3 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" className="w-32 h-4" />
          <Skeleton variant="rounded" height={40} className="w-full" />
        </div>
      ))}
      <div className="flex space-x-3 pt-4">
        <Skeleton variant="rounded" height={40} className="w-24" />
        <Skeleton variant="rounded" height={40} className="w-24" />
      </div>
    </div>
  );
}
