import { ListTodo, List } from "lucide-react";
import { EmptyStatesProps } from "@/data/Tasks/interfaces";

export default function EmptyStates({ type, onCreateListClick }: EmptyStatesProps) {
  if (type === 'no-lists') {
    return (
      <div className="text-center py-12">
        <ListTodo size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Brak list zadań</h3>
        <p className="text-gray-500 mb-4">Utwórz swoją pierwszą listę zadań, aby rozpocząć organizację.</p>
        <button
          onClick={onCreateListClick}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Utwórz pierwszą listę
        </button>
      </div>
    );
  }

  if (type === 'no-list-selected') {
    return (
      <div className="text-center py-12">
        <List size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Wybierz listę zadań</h3>
        <p className="text-gray-500">Wybierz listę z menu powyżej, aby wyświetlić zadania.</p>
      </div>
    );
  }

  return null;
}
