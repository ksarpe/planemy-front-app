import { NotificationSettingsSection, PersonalInformationSection, SecuritySection } from "@/components/ui/User";
import { updateUserProfile } from "@shared/api/user_profile";
import type { NotificationSettings } from "@shared/data/User";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { SkeletonText } from "../Utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserInfo {
  username: string;
  email: string;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, refetchUser } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const { language, setLanguage } = usePreferencesContext();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    tasks: true,
    events: false,
    sharing: true,
  });

  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isDirty, setIsDirty] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setUserInfo({
        username: user.username || "",
        email: user.email || "",
      });
      setSelectedLanguage(language);
      setIsDirty(false);
    }
  }, [isOpen, user, language]);

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo((prev: UserInfo) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang as "en" | "pl" | "de");
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) {
      const confirm = window.confirm("Masz niezapisane zmiany. Czy na pewno chcesz zamknąć?");
      if (!confirm) return;
    }
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isDirty]);

  const handleSave = async () => {
    try {
      // Save language
      if (selectedLanguage !== language) {
        setLanguage(selectedLanguage);
      }

      // Save user profile if changed
      if (user && (userInfo.username !== user.username || userInfo.email !== user.email)) {
        await updateUserProfile({
          username: userInfo.username,
          email: userInfo.email,
        });
        await refetchUser();
      }

      setIsDirty(false);
      showSuccess("Zmiany zostały zapisane");
    } catch (e) {
      console.error("Failed to save settings:", e);
      showError("Nie udało się zapisać zmian");
    }
  };

  const handleDiscard = () => {
    if (user) {
      setUserInfo({
        username: user.username || "",
        email: user.email || "",
      });
    }
    setSelectedLanguage(language);
    setIsDirty(false);
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-bg-alt rounded-xl shadow-2xl w-[60vw] max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-text">Ustawienia</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-bg-hover transition-colors text-text-muted hover:text-text">
              <FiX size={24} />
            </button>
          </div>

          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {!user ? (
              <div className="space-y-6">
                <SkeletonText lines={3} className="w-full" />
                <SkeletonText lines={2} className="w-3/4" />
                <SkeletonText lines={4} className="w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <PersonalInformationSection userInfo={userInfo} handleUserInfoChange={handleUserInfoChange} />

                {/* Simple Language Selector */}
                <div className="bg-bg rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-text mb-4">Język</h3>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-4 py-2 bg-bg-alt border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <NotificationSettingsSection
                  notifications={notifications}
                  handleNotificationChange={handleNotificationChange}
                />
                <SecuritySection />
              </div>
            )}
          </div>

          {/* Footer with actions - only when dirty */}
          {isDirty && (
            <div className="border-t border-border p-4 bg-bg flex items-center justify-end gap-3">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 rounded-lg text-text-muted hover:text-text hover:bg-bg-hover transition-colors">
                Odrzuć zmiany
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/80 transition-colors">
                Zapisz zmiany
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Render modal in a portal to escape sidebar container
  return createPortal(modalContent, document.body);
}
