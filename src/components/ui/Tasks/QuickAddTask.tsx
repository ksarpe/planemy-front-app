import { useState, useRef, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import type { QuickAddTaskProps } from "@/data/Tasks/interfaces";
import { useCreateTask } from "@/hooks/tasks/useTasks";

export default function QuickAddTask({ onCancel }: QuickAddTaskProps) {
  const { currentTaskList } = useTaskContext();
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
    if (!taskTitle.trim() || !currentTaskList) return;

    try {
      createTask(
        {
          listId: currentTaskList.id,
          title: taskTitle.trim(),
        },
        {
          onSuccess: () => {
            // To wykona się dopiero po pomyślnym dodaniu zadania do bazy
            setTaskTitle(""); // Czyścimy input
            onCancel(); // Zamykamy komponent
          },
        },
      );
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
    <div ref={containerRef} className="border-l-4 border-success  rounded-md p-4 bg-green-50  hover:shadow-md mb-3">
      <div className="flex items-center gap-3">
        {/* Plus Icon */}
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <Plus size={16} className="text-success-hover " />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz nazwę zadania..."
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900  placeholder-gray-500 "
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
