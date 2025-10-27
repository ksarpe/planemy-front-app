import { type ReactNode } from "react";

interface SkeletonWrapperProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback when data is empty
  isEmpty?: boolean;
}

/**
 * Wrapper component that handles loading, empty, and loaded states
 *
 * @example
 * <SkeletonWrapper
 *   isLoading={isLoading}
 *   skeleton={<SkeletonList count={5} />}
 *   isEmpty={tasks.length === 0}
 *   fallback={<EmptyState />}
 * >
 *   <TaskList tasks={tasks} />
 * </SkeletonWrapper>
 */
export function SkeletonWrapper({ isLoading, skeleton, children, fallback, isEmpty = false }: SkeletonWrapperProps) {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  if (isEmpty && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
