import { useState } from "react";
import { useTaskContext } from "@/hooks/useTaskContext";
import { X, Share2, Search, UserPlus, Check, AlertCircle } from "lucide-react";
import { SharePermission, UserProfile } from "@/data/types";

interface ShareTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskListId: string;
  taskListName: string;
}

export default function ShareTaskListModal({ 
  isOpen, 
  onClose, 
  taskListId, 
  taskListName 
}: ShareTaskListModalProps) {
  const { shareTaskList, searchUsers, loading } = useTaskContext();
  
  const [userEmail, setUserEmail] = useState("");
  const [permission, setPermission] = useState<SharePermission>("view");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSearchUser = async () => {
    if (!userEmail.trim()) return;
    
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);
    
    try {
      const results = await searchUsers(userEmail.trim());
      setSearchResults(results);
      
      if (results.length === 0) {
        setSearchError("Nie znaleziono użytkownika o tym adresie email");
      }
    } catch (error) {
      console.log("Error searching users:", error);
      setSearchError("Błąd podczas wyszukiwania użytkownika");
    } finally {
      setIsSearching(false);
    }
  };

  const handleShare = async () => {
    if (!selectedUser) return;
    
    try {
      await shareTaskList(taskListId, selectedUser.email, permission);
      setShareSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setUserEmail("");
        setSelectedUser(null);
        setSearchResults([]);
        setShareSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sharing task list:", error);
    }
  };

  const handleClose = () => {
    setUserEmail("");
    setSelectedUser(null);
    setSearchResults([]);
    setSearchError("");
    setShareSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Share2 size={20} />
            Udostępnij listę: {taskListName}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {shareSuccess ? (
            <div className="text-center py-8">
              <Check size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-green-800 mb-2">Lista została udostępniona!</h3>
              <p className="text-green-600">Użytkownik otrzyma powiadomienie o udostępnieniu.</p>
            </div>
          ) : (
            <>
              {/* Search User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres email użytkownika
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="np. uzytkownik@example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                  />
                  <button
                    onClick={handleSearchUser}
                    disabled={!userEmail.trim() || isSearching}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Search size={16} />
                    {isSearching ? "Szukam..." : "Szukaj"}
                  </button>
                </div>
                
                {searchError && (
                  <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {searchError}
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wybierz użytkownika
                  </label>
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserPlus size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.displayName || user.email}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permission Level */}
              {selectedUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poziom uprawnień
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="view"
                        checked={permission === "view"}
                        onChange={(e) => setPermission(e.target.value as SharePermission)}
                        className="text-blue-600"
                      />
                      <div>
                        <p className="font-medium">Tylko odczyt</p>
                        <p className="text-sm text-gray-500">Może przeglądać zadania, ale nie może ich edytować</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="edit"
                        checked={permission === "edit"}
                        onChange={(e) => setPermission(e.target.value as SharePermission)}
                        className="text-blue-600"
                      />
                      <div>
                        <p className="font-medium">Edycja</p>
                        <p className="text-sm text-gray-500">Może dodawać, edytować i usuwać zadania</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="admin"
                        checked={permission === "admin"}
                        onChange={(e) => setPermission(e.target.value as SharePermission)}
                        className="text-blue-600"
                      />
                      <div>
                        <p className="font-medium">Administrator</p>
                        <p className="text-sm text-gray-500">Pełne uprawnienia, może udostępniać innym użytkownikom</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleShare}
                  disabled={!selectedUser || loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Udostępnij
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
