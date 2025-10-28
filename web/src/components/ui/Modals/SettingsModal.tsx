import { NotificationSettingsSection, PersonalInformationSection, SecuritySection } from "@/components/ui/User";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/shadcn/tabs";
import { updateUserProfile } from "@shared/api/user_profile";
import type { NotificationSettings } from "@shared/data/User";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiBell, FiGlobe, FiShield, FiUser, FiX } from "react-icons/fi";
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
          className="bg-bg-alt rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-bg-muted-light">
            <div>
              <h2 className="text-2xl font-bold text-text">Ustawienia</h2>
              <p className="text-sm text-text-muted mt-1">Zarządzaj swoim kontem i preferencjami</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2.5 rounded-lg hover:bg-bg-muted-light transition-all text-text-muted hover:text-text">
              <FiX size={24} />
            </button>
          </div>

          {/* Content - scrollable */}
          <div className="flex-1 overflow-hidden flex">
            {!user ? (
              <div className="space-y-6 p-6">
                <SkeletonText lines={3} className="w-full" />
                <SkeletonText lines={2} className="w-3/4" />
                <SkeletonText lines={4} className="w-full" />
              </div>
            ) : (
              <Tabs defaultValue="profile" orientation="vertical" className="w-full h-full flex flex-row">
                {/* Sidebar with tabs */}
                <div className="w-56 bg-bg border-e border-bg-muted-light flex-shrink-0">
                  <div className="p-4">
                    <h3 className="text-xs font-semibold text-text-muted uppercase mb-3 px-3">Account</h3>
                    <TabsList variant="underline" className="w-full flex-col items-stretch">
                      <TabsTab value="profile" className="gap-3 justify-start">
                        <FiUser size={16} />
                        <span>Profil</span>
                      </TabsTab>
                      <TabsTab value="language" className="gap-3 justify-start">
                        <FiGlobe size={16} />
                        <span>Język</span>
                      </TabsTab>
                    </TabsList>
                  </div>

                  <div className="px-4 pb-4">
                    <h3 className="text-xs font-semibold text-text-muted uppercase mb-3 px-3">Workspace</h3>
                    <TabsList variant="underline" className="w-full flex-col items-stretch">
                      <TabsTab value="notifications" className="gap-3 justify-start">
                        <FiBell size={16} />
                        <span>Powiadomienia</span>
                      </TabsTab>
                      <TabsTab value="security" className="gap-3 justify-start">
                        <FiShield size={16} />
                        <span>Bezpieczeństwo</span>
                      </TabsTab>
                    </TabsList>
                  </div>
                </div>

                {/* Tab panels */}
                <TabsPanel value="profile" className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-text mb-2">Informacje osobiste</h3>
                    <p className="text-sm text-text-muted mb-6">Zarządzaj swoim profilem i danymi osobowymi</p>
                    <PersonalInformationSection userInfo={userInfo} handleUserInfoChange={handleUserInfoChange} />
                  </div>
                </TabsPanel>

                <TabsPanel value="language" className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-text mb-2">Język aplikacji</h3>
                    <p className="text-sm text-text-muted mb-6">Wybierz język interfejsu aplikacji</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-3">Preferowany język</label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="w-full px-4 py-2.5 bg-bg-alt border border-bg-muted-light rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                          <option value="pl">Polski 🇵🇱</option>
                          <option value="en">English 🇬🇧</option>
                          <option value="de">Deutsch 🇩🇪</option>
                        </select>
                      </div>
                      <p className="text-xs text-text-muted">Zmiana języka zostanie zastosowana natychmiast</p>
                    </div>
                  </div>
                </TabsPanel>

                <TabsPanel value="notifications" className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-text mb-2">Powiadomienia</h3>
                    <p className="text-sm text-text-muted mb-6">Zarządzaj preferencjami powiadomień</p>
                    <NotificationSettingsSection
                      notifications={notifications}
                      handleNotificationChange={handleNotificationChange}
                    />
                  </div>
                </TabsPanel>

                <TabsPanel value="security" className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-text mb-2">Bezpieczeństwo</h3>
                    <p className="text-sm text-text-muted mb-6">Zarządzaj ustawieniami bezpieczeństwa konta</p>
                    <SecuritySection />
                  </div>
                </TabsPanel>
              </Tabs>
            )}
          </div>

          {/* Footer with actions - only when dirty */}
          {isDirty && (
            <div className="border-t border-bg-muted-light p-6 bg-bg flex items-center justify-between">
              <p className="text-sm text-text-muted">Masz niezapisane zmiany</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDiscard}
                  className="px-5 py-2.5 rounded-lg text-text bg-bg-alt hover:bg-bg-muted-light transition-all font-medium">
                  Odrzuć zmiany
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/80 transition-all shadow-sm">
                  Zapisz zmiany
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Render modal in a portal to escape sidebar container
  return createPortal(modalContent, document.body);
}
