import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { useNavigate } from "react-router-dom";
//import { useT } from "@shared/hooks/utils/useT";
import { useDashboardSummary } from "@shared/hooks/combined/useSummary";
import { FiChevronRight, FiList, FiShoppingBag } from "react-icons/fi";
import { SkeletonText } from "../Utils";

export default function SummaryCards() {
  const navigate = useNavigate();
  //const { t } = useT();

  const { defaultShoppingListId, defaultTaskListId } = usePreferencesContext();
  //TODO check if we can already give empty string on PreferenceContext level
  //As we need it for useQuery function to trigger/untrigger enabled state.
  const { data: summaryData, isLoading: isLoadingSummary } = useDashboardSummary(
    defaultShoppingListId || "",
    defaultTaskListId || "",
  );

  return (
    <div className="space-y-4">
      {/* Compact Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Shopping Summary */}
        <div
          className="bg-bg rounded-lg p-4 flex items-center justify-between cursor-pointer"
          onClick={() => navigate("/shopping")}>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-xs">LISTA ZAKUPÓW</p>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary-light rounded-lg">
                <FiShoppingBag className="h-8 w-8 text-primary" />
              </div>
              {!isLoadingSummary && summaryData ? (
                <div>
                  <p className="font-medium text-text">{summaryData.defaultShoppingListName || "Brak listy zakupów"}</p>
                  {/* <p className="text-sm text-gray-500">
              {shoppingPending === 0
                ? t("dashboard.allBought")
                : t("dashboard.productsCount", { count: shoppingPending })}
            </p> */}
                </div>
              ) : (
                <SkeletonText lines={1} className="w-32" />
              )}
            </div>
          </div>
          <button className="text-primary p-2 cursor-pointer rounded-lg hover:bg-bg-alt">
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Task summary */}
        <div
          className="bg-bg rounded-lg p-4 flex items-center justify-between cursor-pointer"
          onClick={() => navigate("/tasks")}>
          <div className="flex flex-col gap-2">
            <p className="text-text-muted text-xs">LISTA ZADAŃ</p>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary-light rounded-lg">
                <FiList className="h-8 w-8 text-primary" />
              </div>
              {!isLoadingSummary && summaryData ? (
                <div>
                  <p className="font-medium text-text">{summaryData.defaultTaskListName || "Brak listy zadań"}</p>
                  {/* <p className="text-sm text-gray-500">
            {tasksPending === 0 ? t("dashboard.allDone") : t("dashboard.openTasks", { count: tasksPending })}
          </p> */}
                </div>
              ) : (
                <SkeletonText lines={1} className="w-32" />
              )}
            </div>
          </div>
          <button className="text-primary p-2 cursor-pointer rounded-lg hover:bg-bg-alt">
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
