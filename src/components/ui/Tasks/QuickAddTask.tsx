import { useState, useRef, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import type { QuickAddTaskProps } from "@/data/Tasks/interfaces";

export default function QuickAddTask({ onCancel }: QuickAddTaskProps) {
  const { addTask, currentTaskList } = useTaskContext();
  const [taskTitle, setTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
    try {
      await addTask(
        currentTaskList.id,
        taskTitle.trim(),
        null, // description
        null, // dueDate
        [], // labels
      );
      setTaskTitle("");
      onCancel(); // Zamknij quick add po dodaniu
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsSubmitting(false);
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
    <div
      ref={containerRef}
      className="border-l-4 border-blue-500 rounded-lg p-4 bg-blue-50 hover:shadow-md transition-all duration-200 mb-3">
      <div className="flex items-center gap-3">
        {/* Plus Icon */}
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <Plus size={16} className="text-blue-600" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz nazwę zadania..."
          disabled={isSubmitting}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder-gray-500"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            disabled={!taskTitle.trim() || isSubmitting}
            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Dodaj zadanie (Enter)">
            <Check size={16} />
          </button>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Anuluj (Escape)">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
