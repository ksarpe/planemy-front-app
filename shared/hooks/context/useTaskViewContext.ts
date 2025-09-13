import { use } from "react";
import { TaskViewContext } from "@shared/context/TaskViewContext";

export function useTaskViewContext() {
  const context = use(TaskViewContext);
  if (context === undefined) {
    throw new Error("useTaskViewContext must be used within a TaskViewProvider");
  }
  return context;
}
