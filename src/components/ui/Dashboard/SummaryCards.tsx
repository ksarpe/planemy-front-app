import { useShoppingContext } from "@/hooks/context/useShoppingContext";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useNavigate } from "react-router-dom";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useShoppingItemsQuery } from "@/hooks/shopping/useShoppingItems";
import { useCreateShoppingList } from "@/hooks/shopping/useShoppingLists";
import { useToastContext } from "@/hooks/context/useToastContext";
import { useT } from "@/hooks/useT";
import { ShoppingCart, ListTodo, ChevronRight, Plus, Calendar, DollarSign, Package } from "lucide-react";
import { useState } from "react";

export default function SummaryCards() {
  const navigate = useNavigate();
  const { t } = useT();
  const { shoppingLists, currentList } = useShoppingContext();
  const { currentTaskList, currentTaskListId } = useTaskContext();
  const { mainListId, defaultShoppingListId } = usePreferencesContext();
  const { showToast } = useToastContext();
  const createShoppingListMutation = useCreateShoppingList();
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Determine default shopping list (default from preferences, then current, then first)
  const defaultShoppingList =
    shoppingLists.find((list) => list.id === defaultShoppingListId) || currentList || shoppingLists[0] || null;
  const { data: shoppingItems = [] } = useShoppingItemsQuery(defaultShoppingList ? defaultShoppingList.id : "");
  const shoppingPending = shoppingItems.filter((i) => !i.isCompleted).length;

  // Tasks for current/default task list
  const effectiveTaskListId = currentTaskListId || currentTaskList?.id || mainListId || null;
  const { data: tasks = [] } = useTasks(effectiveTaskListId);
  const tasksPending = tasks.filter((t) => !t.isCompleted).length;

  const handleCreateShoppingList = async () => {
    if (isCreatingList) return;

    setIsCreatingList(true);
    try {
      const listName = t("dashboard.listName", { date: new Date().toLocaleDateString() });
      await createShoppingListMutation.mutateAsync({ name: listName });
      showToast("success", t("dashboard.listCreated"));
      navigate("/shopping");
    } catch {
      showToast("error", t("dashboard.listCreationFailed"));
    } finally {
      setIsCreatingList(false);
    }
  };

  const quickActions = [
    {
      icon: Plus,
      label: t("dashboard.addTask"),
      color: "blue",
      onClick: () => navigate("/tasks"),
      bgColor: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Calendar,
      label: t("dashboard.newEvent"),
      color: "green",
      onClick: () => navigate("/calendar"),
      bgColor: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Package,
      label: t("dashboard.shoppingList"),
      color: "purple",
      onClick: handleCreateShoppingList,
      bgColor: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
      disabled: isCreatingList,
    },
    {
      icon: DollarSign,
      label: t("dashboard.newPayment"),
      color: "yellow",
      onClick: () => navigate("/payments"),
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Actions Section */}
      <div className="bg-bg-alt rounded-lg p-4 md:p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-text mb-4">{t("dashboard.quickActions")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex flex-col items-center p-3 md:p-4 ${action.bgColor} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${action.iconColor} mb-2`} />
                <span className="text-xs md:text-sm font-medium text-text text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shopping Summary */}
        <div className="bg-bg-alt rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text">{t("dashboard.shoppingList")}</p>
                <p className="text-sm text-gray-500">
                  {shoppingPending === 0 ? t("dashboard.allBought") : t("dashboard.productsCount", { count: shoppingPending })}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/shopping")}
              className="text-primary hover:text-primary/80 p-2 rounded-full hover:bg-primary/10 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="bg-bg-alt rounded-lg p-4 border border-gray-200">
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
        </div>
      </div>
    </div>
  );
}
