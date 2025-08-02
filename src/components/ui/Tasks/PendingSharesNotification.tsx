import { Clock, UserCheck, Share2 } from "lucide-react";
import { usePendingShares } from "@/hooks/permissions/usePermissions";
import { ShareableObjectType } from "@/data/Utils/types";
import { Permission } from "@/data/Utils/interfaces";

export default function PendingSharesNotification({ object_type }: { object_type: ShareableObjectType }) {
  const { data: getPendingShares } = usePendingShares(object_type);

  const pendingShares = getPendingShares ? getPendingShares : [];

  if (pendingShares.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {pendingShares.map((share: Permission) => {
        //const taskListInfo = taskListsInfo[share.object_id];

        return (
          <div
            key={share.id}
            className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Share2 size={16} className="text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Nowe udostępnienie</span>
                </div>

                <p className="text-sm font-medium text-gray-900 mb-1">Lista zadań została udostępniona</p>

                {/* {taskListInfo && (
                  <p className="text-xs text-gray-500 mb-2">
                    {taskListInfo.tasksCount}{" "}
                    {taskListInfo.tasksCount === 1 ? "zadanie" : taskListInfo.tasksCount < 5 ? "zadania" : "zadań"}
                  </p>
                )} */}

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Clock size={12} />
                  <span>{new Date(share.granted_at).toLocaleDateString("pl-PL")}</span>
                </div>

                <div className="flex gap-2">
                  {/* <button
                    onClick={() => acceptSharedList(share.id!)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors disabled:opacity-50">
                    <Check size={12} />
                    Akceptuj
                  </button> */}

                  {/* <button
                    onClick={() => rejectSharedList(share.id!)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-50">
                    <X size={12} />
                    Odrzuć
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
