import type { QuickAddTaskProps } from "@shared/data/Tasks/interfaces";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useCreateTask } from "@shared/hooks/tasks/useTasks";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function QuickAddTask({ onCancel }: QuickAddTaskProps) {
  const { currentTaskListId } = useTaskViewContext();
  const { mutate: createTask } = useCreateTask();
  const [taskTitle, setTaskTitle] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Obsługa kliknięcia poza komponentem
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    // Dodaj nasłuchiwacz na document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup - usuń nasłuchiwacz przy odmontowaniu
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  const handleSubmit = async () => {
    if (!taskTitle.trim() || !currentTaskListId) return;

    try {
      createTask({
        task_list_id: currentTaskListId,
        title: taskTitle.trim(),
      });
      setTaskTitle("");
      onCancel();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div ref={containerRef} className="border-success rounded-lg p-4 text-text bg-bg-muted-light">
      <div className="flex items-center gap-3">
        {/* Input Field */}
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me your plans..."
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder-gray-500 "
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Confirm Button */}
          <button onClick={handleSubmit} className="p-1 text-success  cursor-pointer" title="Dodaj zadanie (Enter)">
            <Check size={16} />
          </button>

          {/* Cancel Button */}
          <button onClick={onCancel} className="p-1 text-red-400  cursor-pointer" title="Anuluj (Escape)">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
