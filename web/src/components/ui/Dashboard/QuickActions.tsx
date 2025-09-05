import { CheckCircle2, Calendar, Package, Clock } from "lucide-react";
import { useT } from "@shared/hooks/useT";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateShoppingList } from "@shared/hooks/shopping/useShoppingLists";
import { useTaskContext } from "@shared/hooks/context/useTaskContext";
import { useToastContext } from "@shared/hooks/context/useToastContext";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import QuickAddTask from "@/components/ui/Tasks/QuickAddTask";

export default function QuickActions() {
  const { t } = useT();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const { currentTaskList, currentTaskListId } = useTaskContext();
  const { mainListId } = usePreferencesContext();
  const createShoppingListMutation = useCreateShoppingList();

  const [showQuickTask, setShowQuickTask] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Determine effective task list ID
  const effectiveTaskListId = currentTaskListId || currentTaskList?.id || mainListId || null;

  const handleQuickTask = () => {
    if (!effectiveTaskListId) {
      showToast("error", t("tasks.messages.noTaskListSelected"));
      navigate("/tasks");
      return;
    }
    setShowQuickTask(true);
  };

  const handleQuickEvent = () => {
    // Navigate to calendar with a flag to open quick event modal
    navigate("/calendar?quick=true");
  };

  const handleQuickShoppingList = async () => {
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

  const handleQuickPayment = () => {
    navigate("/payments?new=true");
  };

  const quickActions = [
    {
      icon: CheckCircle2,
      label: t("dashboard.addTask"),
      description: t("dashboard.addTaskDesc"),
      onClick: handleQuickTask,
      bgColor: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      disabled: false,
    },
    {
      icon: Calendar,
      label: t("dashboard.addEvent"),
      description: t("dashboard.addEventDesc"),
      onClick: handleQuickEvent,
      bgColor: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30",
      iconColor: "text-green-600 dark:text-green-400",
      disabled: false,
    },
    {
      icon: Package,
      label: t("dashboard.shoppingList"),
      description: t("dashboard.shoppingListDesc"),
      onClick: handleQuickShoppingList,
      bgColor: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      disabled: isCreatingList,
    },
    {
      icon: Clock,
      label: t("dashboard.newPayment"),
      description: t("dashboard.newPaymentDesc"),
      onClick: handleQuickPayment,
      bgColor: "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-800/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      disabled: false,
    },
  ];

  return (
    <div className="bg-bg-alt dark:bg-bg-alt-dark rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark mb-4">{t("dashboard.quickActions")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`group relative flex flex-col items-center p-4 ${action.bgColor} rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}>
              <Icon className={`h-8 w-8 ${action.iconColor} mb-2 transition-transform group-hover:scale-110`} />
              <span className="text-sm font-medium text-text dark:text-text-dark text-center mb-1">{action.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {action.description}
              </span>
              {action.disabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Task Input */}
      {showQuickTask && effectiveTaskListId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg dark:bg-bg-dark rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-4">
              {t("dashboard.quickTaskTitle")}
            </h3>
            <QuickAddTask onCancel={() => setShowQuickTask(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
