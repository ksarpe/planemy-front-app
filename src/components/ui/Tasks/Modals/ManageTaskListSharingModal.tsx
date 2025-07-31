import React, { useState, useEffect, useCallback } from "react";
import { X, UserPlus, Mail, Clock, CheckCircle, UserX } from "lucide-react";
import { getTaskListSharedUsers, revokeTaskListAccess, shareTaskListWithUser } from "@/firebase/tasks";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/useToastContext";

import type { SharedUser, ManageTaskListSharingModalProps } from "@/data/Tasks/interfaces";
import type { SharePermission } from "@/data/Utils/types";

export default function ManageTaskListSharingModal({
  isOpen,
  onClose,
  listId,
  listName,
}: ManageTaskListSharingModalProps) {
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharingEmail, setSharingEmail] = useState("");
  const [sharingPermission, setSharingPermission] = useState<SharePermission>("view");
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Load shared users when modal opens
  const loadSharedUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await getTaskListSharedUsers(listId);
      setSharedUsers(users);
    } catch (error) {
      console.error("Error loading shared users:", error);
      showToast("error", "Błąd podczas ładowania udostępnień");
    } finally {
      setLoading(false);
    }
  }, [listId, showToast]);

  useEffect(() => {
    if (isOpen && listId) {
      loadSharedUsers();
    }
  }, [isOpen, listId, loadSharedUsers]);

  const handleShareWithUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharingEmail.trim() || !user) return;

    setIsSharing(true);
    try {
      await shareTaskListWithUser(listId, sharingEmail.trim(), sharingPermission, user.uid);
      setSharingEmail("");
      setSharingPermission("view");
      await loadSharedUsers();
      showToast("success", "Zaproszenie zostało wysłane");
    } catch (error: unknown) {
      console.error("Error sharing list:", error);
      const errorMessage = error instanceof Error ? error.message : "Błąd podczas udostępniania";
      showToast("error", errorMessage);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevokeAccess = async (userId: string, userEmail: string) => {
    if (!confirm(`Czy na pewno chcesz cofnąć dostęp dla ${userEmail}?`)) {
      return;
    }

    try {
      await revokeTaskListAccess(listId, userId);
      await loadSharedUsers();
      showToast("success", "Dostęp został cofnięty");
    } catch (error) {
      console.error("Error revoking access:", error);
      showToast("error", "Błąd podczas cofania dostępu");
    }
  };

  const getStatusIcon = (status: "pending" | "accepted") => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: "pending" | "accepted") => {
    switch (status) {
      case "pending":
        return "Oczekuje";
      case "accepted":
        return "Zaakceptowane";
      default:
        return status;
    }
  };

  const getPermissionText = (permission: SharePermission) => {
    switch (permission) {
      case "view":
        return "Tylko odczyt";
      case "edit":
        return "Edycja";
      case "admin":
        return "Administrator";
      default:
        return permission;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Zarządzaj udostępnieniem</h2>
            <p className="text-sm text-gray-600 mt-1">Lista: {listName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Add new sharing section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Dodaj nowe udostępnienie
            </h3>
            <form onSubmit={handleShareWithUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email użytkownika
                </label>
                <input
                  type="email"
                  id="email"
                  value={sharingEmail}
                  onChange={(e) => setSharingEmail(e.target.value)}
                  placeholder="przykład@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="permission" className="block text-sm font-medium text-gray-700 mb-1">
                  Uprawnienia
                </label>
                <select
                  id="permission"
                  value={sharingPermission}
                  onChange={(e) => setSharingPermission(e.target.value as SharePermission)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="view">Tylko odczyt</option>
                  <option value="edit">Edycja</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSharing || !sharingEmail.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isSharing ? "Wysyłanie..." : "Wyślij zaproszenie"}
              </button>
            </form>
          </div>

          {/* Current sharing list */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Aktualne udostępnienia ({sharedUsers.length})</h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : sharedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Brak udostępnień</p>
                <p className="text-sm">Dodaj pierwsze udostępnienie powyżej</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sharedUsers.map((sharedUser) => (
                  <div
                    key={sharedUser.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {sharedUser.displayName?.[0] || sharedUser.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{sharedUser.displayName || sharedUser.email}</p>
                          {sharedUser.displayName && <p className="text-sm text-gray-500">{sharedUser.email}</p>}
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

                      <button
                        onClick={() => handleRevokeAccess(sharedUser.id, sharedUser.email)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cofnij dostęp">
                        <UserX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
