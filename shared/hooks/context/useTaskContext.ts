import { use } from "react";
import { TaskContext } from "../../context/TaskContext";

export const useTaskContext = () => {
  const context = use(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
