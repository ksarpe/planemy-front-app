import { useShoppingContext } from "@/hooks/context/useShoppingContext";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useNavigate } from "react-router-dom";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useShoppingItemsQuery } from "@/hooks/shopping/useShoppingItems";
import { ShoppingCart, ListTodo, ChevronRight } from "lucide-react";

export default function SummaryCards() {
  const navigate = useNavigate();
  const { shoppingLists, currentList } = useShoppingContext();
  const { currentTaskList, currentTaskListId } = useTaskContext();
  const { mainListId, defaultShoppingListId } = usePreferencesContext();

  // Determine default shopping list (default from preferences, then current, then first)
  const defaultShoppingList = 
    shoppingLists.find(list => list.id === defaultShoppingListId) || 
    currentList || 
    shoppingLists[0] || 
    null;
  const { data: shoppingItems = [] } = useShoppingItemsQuery(defaultShoppingList ? defaultShoppingList.id : "");
  const shoppingPending = shoppingItems.filter((i) => !i.isCompleted).length;

  // Tasks for current/default task list
  const effectiveTaskListId = currentTaskListId || currentTaskList?.id || mainListId || null;
  const { data: tasks = [] } = useTasks(effectiveTaskListId);
  const tasksPending = tasks.filter((t) => !t.isCompleted).length;

  return (
    <>
      <div className="bg-bg-alt rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
            Lista zakupów
            {shoppingPending > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                {shoppingPending}
              </span>
            )}
          </h3>
          <button
            onClick={() => navigate("/shopping")}
            className="text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center py-8">
          {shoppingPending === 0 ? (
            <>
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Wszystko kupione!</p>
            </>
          ) : (
            <div className="text-left">
              <p className="text-2xl font-bold text-text mb-1">{shoppingPending}</p>
              <p className="text-sm text-gray-500">produktów do kupienia</p>
              {defaultShoppingList && <p className="text-xs text-gray-400 mt-2">{defaultShoppingList.name}</p>}
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/shopping")}
            className="w-full text-center py-2 text-sm text-primary hover:text-primary/80 font-medium">
            Zobacz listę zakupów
          </button>
        </div>
      </div>

      <div className="bg-bg-alt rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text flex items-center">
            <ListTodo className="h-5 w-5 mr-2 text-primary" />
            Zadania
            {tasksPending > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                {tasksPending}
              </span>
            )}
          </h3>
          <button
            onClick={() => navigate("/tasks")}
            className="text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center py-8">
          {tasksPending === 0 ? (
            <>
              <ListTodo className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Wszystkie zadania wykonane!</p>
            </>
          ) : (
            <div className="text-left">
              <p className="text-2xl font-bold text-text mb-1">{tasksPending}</p>
              <p className="text-sm text-gray-500">otwartych zadań</p>
              {currentTaskList && <p className="text-xs text-gray-400 mt-2">{currentTaskList.name}</p>}
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/tasks")}
            className="w-full text-center py-2 text-sm text-primary hover:text-primary/80 font-medium">
            Zobacz wszystkie zadania
          </button>
        </div>
      </div>
    </>
  );
}
