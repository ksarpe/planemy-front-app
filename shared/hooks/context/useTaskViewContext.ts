import { TaskViewContext } from "@shared/context/TaskViewContext";
import { use } from "react";

export function useTaskViewContext() {
  const context = use(TaskViewContext);
  if (context === undefined) {
    throw new Error("useTaskViewContext must be used within a TaskViewProvider");
  }
  return context;
}
