import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { useShareObject } from "@shared/hooks/permissions/usePermissions";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";

import type { ManageTaskListSharingModalProps } from "@shared/data/Tasks/interfaces";
import type { SharePermission } from "@shared/data/Utils/types";
import { createPortal } from "react-dom";

export default function ManageTaskListSharingModal({
  isOpen,
  onClose,
  listId,
  listName,
}: ManageTaskListSharingModalProps) {
  const { mutate: shareObject } = useShareObject();
  const [sharingEmail, setSharingEmail] = useState("");
  const [sharingPermission, setSharingPermission] = useState<SharePermission>("view");
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuthContext();
  const { showToast } = useToastContext();

  const handleShareWithUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharingEmail.trim() || !user) return;

    setIsSharing(true);
    try {
      shareObject(
        {
          objectId: listId,
          objectType: "task_list",
          targetUserEmail: sharingEmail.trim(),
          permission: sharingPermission,
        },
        {
          onSuccess: () => {
            setSharingEmail("");
            setSharingPermission("view");
            showToast("success", "Zaproszenie zostało wysłane");
          },
        },
      );
    } catch (error: unknown) {
      console.error("Error sharing list:", error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 ">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 ">Zarządzaj udostępnieniem</h2>
            <p className="text-sm text-gray-600  mt-1">Lista: {listName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400  hover:text-gray-600  transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Add new sharing section */}
          <div className="mb-6 p-4 bg-gray-50  rounded-lg">
            <h3 className="text-lg font-medium text-gray-900  mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Dodaj nowe udostępnienie
            </h3>
            <form onSubmit={handleShareWithUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700  mb-1">
                  Email użytkownika
                </label>
                <input
                  type="email"
                  id="email"
                  value={sharingEmail}
                  onChange={(e) => setSharingEmail(e.target.value)}
                  placeholder="przykład@email.com"
                  className="w-full px-3 py-2 border border-gray-300  bg-white  text-gray-900  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  required
                />
              </div>
              <div>
                <label htmlFor="permission" className="block text-sm font-medium text-gray-700  mb-1">
                  Uprawnienia
                </label>
                <select
                  id="permission"
                  value={sharingPermission}
                  onChange={(e) => setSharingPermission(e.target.value as SharePermission)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="view">Tylko odczyt</option>
                  <option value="edit">Edycja</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSharing || !sharingEmail.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isSharing ? "Wysyłanie..." : "Wyślij zaproszenie"}
              </button>
            </form>
          </div>

          {/* Current sharing list */}
          {/* <div>
            <h3 className="text-lg font-medium text-gray-900  mb-4">Aktualne udostępnienia ({sharedUsers.length})</h3>

            { sharedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 ">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300 " />
                <p>Brak udostępnień</p>
                <p className="text-sm">Dodaj pierwsze udostępnienie powyżej</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sharedUsers.map((sharedUser) => (
                  <div
                    key={sharedUser.id}
                    className="flex items-center justify-between p-4 bg-white  border border-gray-200  rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100  rounded-full flex items-center justify-center">
                          <span className="text-blue-600  font-medium">
                            {sharedUser.displayName?.[0] || sharedUser.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 ">{sharedUser.displayName || sharedUser.email}</p>
                          {sharedUser.displayName && <p className="text-sm text-gray-500 ">{sharedUser.email}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(sharedUser.status)}
                          <span className="text-sm text-gray-600">{getStatusText(sharedUser.status)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{getPermissionText(sharedUser.permission)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
