// Example: How to replace Spinner with Skeleton in TasksView.tsx

// BEFORE:
// import Spinner from "../ui/Utils/Spinner";

// if (isLoadingLists) {
//   return (
//     <div className="h-full flex items-center justify-center">
//       <Spinner />
//     </div>
//   );
// }

// AFTER:
// import { SkeletonList, SkeletonTaskItem, SkeletonWrapper } from "@/components/ui/Utils";

// Option 1: Use SkeletonWrapper (Recommended)
{/* <SkeletonWrapper
  isLoading={isLoadingTasks}
  skeleton={<SkeletonList count={8} ItemComponent={SkeletonTaskItem} />}
  isEmpty={tasks.length === 0}
  fallback={<EmptyState message="No tasks yet" icon={<CheckCircle2 />} />}>
  <TaskList tasks={tasks} filter={filter} />
</SkeletonWrapper>; */}

// Option 2: Inline condition
// {
//   isLoadingTasks ? (
//     <SkeletonList count={8} ItemComponent={SkeletonTaskItem} />
//   ) : (
//     <TaskList tasks={tasks} filter={filter} />
//   );
// }

// Option 3: For initial page load
// if (isLoadingLists) {
//   return (
//     <div className="h-full p-6 space-y-4">
//       <div className="flex items-center justify-between">
//         <Skeleton variant="text" className="w-48 h-8" />
//         <Skeleton variant="rounded" height={40} className="w-32" />
//       </div>
//       <SkeletonList count={10} ItemComponent={SkeletonTaskItem} />
//     </div>
//   );
// }
