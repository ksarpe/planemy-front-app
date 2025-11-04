import { NotificationSettingsSection, PersonalInformationSection, SecuritySection } from "@/components/ui/User";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/shadcn/tabs";
import type { NotificationSettings } from "@shared/data/User";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useUpdateUserProfile } from "@shared/hooks/user";
import { useEffect, useState } from "react";
import { FiBell, FiGlobe, FiShield, FiUser } from "react-icons/fi";
import LargeModal, { LargeModalContent, LargeModalFooter, LargeModalHeader } from "../Common/LargeModal";
import Multiselect from "../Common/Multiselect";
import { SkeletonText } from "../Utils";
import { Button } from "../shadcn/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserInfo {
  username: string;
  email: string;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuthContext();
  const { mutate: updateUserProfile, isPending: isSavingProfile } = useUpdateUserProfile({
    onSuccess: () => {
      setIsDirty(false);
      showSuccess("Changes have been saved");
    },
    onError: () => {
      //handleDiscard();
      showError("Failed to save changes to user profile");
    },
  });
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
    // Save language
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }

    if (user && (userInfo.username !== user.username || userInfo.email !== user.email)) {
      updateUserProfile({
        username: userInfo.username,
        email: userInfo.email,
      });
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

  return (
    <LargeModal isOpen={isOpen} onClose={handleClose} preventCloseOnOutsideClick={isDirty}>
      {/* Header */}
      <LargeModalHeader onClose={handleClose}>
        <div>
          <h2 className="text-2xl font-bold text-text">Ustawienia</h2>
          <p className="text-sm text-text-muted mt-1">Zarządzaj swoim kontem i preferencjami</p>
        </div>
      </LargeModalHeader>

      {/* Content */}
      <LargeModalContent className="flex">
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
                <PersonalInformationSection userInfo={userInfo} handleUserInfoChange={handleUserInfoChange} />
              </div>
            </TabsPanel>

            <TabsPanel value="language" className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-3">Preferowany język</label>
                    <Multiselect
                      options={[
                        { label: "Polski 🇵🇱", value: "pl" },
                        { label: "English 🇬🇧", value: "en" },
                        { label: "Deutsch 🇩🇪", value: "de" },
                      ]}
                      placeholder={
                        selectedLanguage === "pl"
                          ? "Polski 🇵🇱"
                          : selectedLanguage === "en"
                          ? "English 🇬🇧"
                          : "Deutsch 🇩🇪"
                      }
                      openedPlaceholder="Szukaj języka..."
                      addButtonText="Dodaj język"
                      onSelect={handleLanguageChange}
                    />
                  </div>
                  <p className="text-xs text-text-muted">Zmiana języka zostanie zastosowana natychmiast</p>
                </div>
              </div>
            </TabsPanel>

            <TabsPanel value="notifications" className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-8">
                <NotificationSettingsSection
                  notifications={notifications}
                  handleNotificationChange={handleNotificationChange}
                />
              </div>
            </TabsPanel>

            <TabsPanel value="security" className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-8">
                <SecuritySection />
              </div>
            </TabsPanel>
          </Tabs>
        )}
      </LargeModalContent>

      {/* Footer with actions - only when dirty */}
      <LargeModalFooter show={isDirty}>
        <p className="text-sm text-red-400">You have unsaved changes!</p>
        <div className="flex items-center gap-3">
          <Button onClick={handleDiscard} variant="default">
            Odrzuć zmiany
          </Button>
          <Button disabled={isSavingProfile} onClick={handleSave} variant="primary">
            Save changes
          </Button>
        </div>
      </LargeModalFooter>
    </LargeModal>
  );
}
