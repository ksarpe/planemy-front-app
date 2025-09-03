import { useShoppingContext } from "@/hooks/context/useShoppingContext";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useNavigate } from "react-router-dom";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useShoppingItemsQuery } from "@/hooks/shopping/useShoppingItems";
import { useT } from "@/hooks/useT";
import { ChevronRight } from "lucide-react";
import { FiShoppingBag, FiList } from "react-icons/fi";

export default function SummaryCards() {
  const navigate = useNavigate();
  const { t } = useT();
  const { shoppingLists } = useShoppingContext();
  const { currentTaskListId, currentTaskList } = useTaskContext();
  const { mainListId, defaultShoppingListId } = usePreferencesContext();

  // Shopping lists summary
  const defaultShoppingList =
    shoppingLists.find((list) => list.id === defaultShoppingListId) || shoppingLists[0] || null;
  const { data: shoppingItems = [] } = useShoppingItemsQuery(defaultShoppingList ? defaultShoppingList.id : "");
  const shoppingPending = shoppingItems.filter((i) => !i.isCompleted).length;

  // Tasks for current/default task list
  const effectiveTaskListId = currentTaskListId ||  mainListId || null;
  const { data: tasks = [] } = useTasks(effectiveTaskListId);
  const tasksPending = tasks.filter((t) => !t.isCompleted).length;

  return (
    <div className="space-y-4">
      {/* Compact Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Shopping Summary */}
        <div
          className="bg-bg rounded-md p-4 flex items-center justify-between cursor-pointer"
          onClick={() => navigate("/shopping")}>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-xs">LISTA ZAKUPÓW</p>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary-light rounded-lg">
                <FiShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text">{defaultShoppingList?.name || ""}</p>
                <p className="text-sm text-gray-500">
                  {shoppingPending === 0
                    ? t("dashboard.allBought")
                    : t("dashboard.productsCount", { count: shoppingPending })}
                </p>
              </div>
            </div>
          </div>
          <button className="text-primary p-2 cursor-pointer rounded-md hover:bg-bg-alt">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        {/* Task summary */}
        <div
          className="bg-bg rounded-md p-4 flex items-center justify-between cursor-pointer"
          onClick={() => navigate("/tasks")}>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-xs">LISTA ZADAŃ</p>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary-light rounded-lg">
                <FiList className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text">{currentTaskList?.name || ""}</p>
                <p className="text-sm text-gray-500">
                  {tasksPending === 0 ? t("dashboard.allDone") : t("dashboard.openTasks", { count: tasksPending })}
                </p>
              </div>
            </div>
          </div>
          <button className="text-primary p-2 cursor-pointer rounded-md hover:bg-bg-alt">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Tasks Summary */}
        {/* <div className="bg-bg-alt rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text">{t("dashboard.tasks")}</p>
                <p className="text-sm text-gray-500">
                  {tasksPending === 0 ? t("dashboard.allDone") : t("dashboard.openTasks", { count: tasksPending })}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/tasks")}
              className="text-primary hover:text-primary/80 p-2 rounded-full hover:bg-primary/10 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
