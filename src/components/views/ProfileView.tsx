import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useEffect, useRef, useState } from "react";
import {
  PersonalInformationSection,
  AppearanceThemeSection,
  NotificationSettingsSection,
  LanguageRegionSection,
  SecuritySection,
  SaveBar,
} from "@/components/ui/User";
import BaseModal from "@/components/ui/Common/BaseModal";
import { useBlocker } from "react-router-dom";
import type { NotificationSettings, UserBasicInfo, UserSettings } from "@/data/User";
import { upsertUserProfile, getUserProfile } from "@/api/user_profile";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import Spinner from "@/components/ui/Utils/Spinner";

export default function ProfileView() {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const { colorTheme, setColorTheme, setColorThemePreview, language, timezone, updateSettings } =
    usePreferencesContext();

  // Track hydration/loading states
  const [profileLoaded, setProfileLoaded] = useState(false);

  // User information (simplified)
  const [userInfo, setUserInfo] = useState<UserBasicInfo>({
    nickname: "",
    email: "",
  });
  const initialUserInfo = useRef<UserBasicInfo>(userInfo);

  // Hydrate user profile from Firestore on enter
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.uid);
        const fallbackNickname = (user.displayName ?? "").toString();
        const fallbackEmail = (user.email ?? "").toString();
        const hydrated: UserBasicInfo = {
          nickname: profile?.nickname ?? fallbackNickname,
          email: profile?.email ?? fallbackEmail,
        };
        if (!mounted) return;
        setUserInfo(hydrated);
        initialUserInfo.current = hydrated; // avoid dirty on load
      } catch (e) {
        console.error("Failed to load user profile", e);
      } finally {
        if (mounted) setProfileLoaded(true);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Preferences
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    tasks: true,
    events: false,
    sharing: true,
  });
  const initialNotifications = useRef<NotificationSettings>(notifications);

  // Stage locale changes locally; persist only when user presses Save.
  const [pendingLanguage, setPendingLanguage] = useState(language);
  const [pendingTimezone, setPendingTimezone] = useState(timezone);

  // Stage theme changes locally but preview immediately
  const initialThemeRef = useRef(colorTheme);
  const [pendingTheme, setPendingTheme] = useState(colorTheme);
  const handleThemeSelect = (index: number) => {
    setPendingTheme(index);
    // live preview but do not persist until save
    (setColorThemePreview ?? setColorTheme)(index);
  };

  const isLoading = !profileLoaded;

  // Sync from context if it changes externally
  useEffect(() => {
    setPendingLanguage(language);
  }, [language]);
  useEffect(() => {
    setPendingTimezone(timezone);
  }, [timezone]);

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  // Local tick to force re-render after saving/discarding when only refs change
  const [dirtyTick, setDirtyTick] = useState(0);
  void dirtyTick; // avoid unused variable lint

  // Detect unsaved changes (recomputed every render)
  const isDirty = (() => {
    const userChanged =
      userInfo.nickname !== initialUserInfo.current.nickname || userInfo.email !== initialUserInfo.current.email;
    const keys = Object.keys(notifications) as (keyof NotificationSettings)[];
    const notifChanged = keys.some((k) => notifications[k] !== initialNotifications.current[k]);
    const localeChanged = pendingLanguage !== language || pendingTimezone !== timezone;
    const themeChanged = pendingTheme !== initialThemeRef.current;
    return userChanged || notifChanged || localeChanged || themeChanged;
  })();

  // Warn on browser/tab close when there are unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    if (isDirty) window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Block in-app navigation when dirty and show confirm modal or flash save bar
  const blocker = useBlocker(isDirty);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [saveBarPing, setSaveBarPing] = useState(0);
  useEffect(() => {
    if (blocker?.state === "blocked") {
      setSaveBarPing((n) => n + 1);
      if (showLeaveConfirm) return;
    }
  }, [blocker?.state, showLeaveConfirm]);

  // Save staged changes
  const handleSave = async () => {
    try {
      const payload: Partial<UserSettings> = {};
      if (pendingLanguage !== language) payload.language = pendingLanguage;
      if (pendingTimezone !== timezone) payload.timezone = pendingTimezone;
      if (pendingTheme !== initialThemeRef.current) payload.colorThemeIndex = pendingTheme;

      // Save settings
      if (Object.keys(payload).length) {
        await updateSettings(payload);
      }
      // Save profile (nickname/email)
      if (
        user &&
        (userInfo.nickname !== initialUserInfo.current.nickname || userInfo.email !== initialUserInfo.current.email)
      ) {
        await upsertUserProfile(user.uid, { nickname: userInfo.nickname, email: userInfo.email });
      }

      // Mark current values as initial
      initialUserInfo.current = userInfo;
      initialNotifications.current = notifications;
      initialThemeRef.current = pendingTheme;
      setDirtyTick((v) => v + 1); // force re-render to recompute isDirty
      showToast("success", "Zapisano zmiany profilu");
    } catch (e) {
      console.error("Failed to save profile changes", e);
      showToast("error", "Nie udało się zapisać zmian");
      throw e;
    }
  };

  // Discard staged changes
  const handleDiscard = () => {
    setUserInfo(initialUserInfo.current);
    setNotifications(initialNotifications.current);
    setPendingLanguage(language);
    setPendingTimezone(timezone);
    setPendingTheme(initialThemeRef.current);
    setColorTheme(initialThemeRef.current); // revert preview
    setDirtyTick((v) => v + 1); // force re-render to recompute isDirty
    showToast("warning", "Zmiany odrzucone");
  };

  const handleSaveAndLeave = async () => {
    try {
      await handleSave();
      setShowLeaveConfirm(false);
      blocker?.proceed?.();
    } catch {
      // Keep modal open on error
    }
  };
  const handleDiscardAndLeave = () => {
    handleDiscard();
    setShowLeaveConfirm(false);
    blocker?.proceed?.();
  };

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full bg-bg-alt  rounded-md shadow-md overflow-auto">
        <div className="p-6 pb-24">
          {isLoading ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <Spinner text="Ładuję profil..." />
            </div>
          ) : (
            <>
              {/* Nowoczesny układ kafelków */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
                {/* Row 1: Duże dane osobowe + kompaktowy motyw */}
                <div className="md:col-span-8 flex flex-col gap-2">
                  <PersonalInformationSection userInfo={userInfo} handleUserInfoChange={handleUserInfoChange} />
                  <LanguageRegionSection
                    language={pendingLanguage}
                    setLanguage={setPendingLanguage}
                    timezone={pendingTimezone}
                    setTimezone={setPendingTimezone}
                  />
                  <NotificationSettingsSection
                    notifications={notifications}
                    handleNotificationChange={handleNotificationChange}
                  />
                </div>
                <div className="md:col-span-4">
                  <AppearanceThemeSection
                    selectedTheme={pendingTheme}
                    setSelectedTheme={handleThemeSelect}
                  />
                </div>

                {/* Row 2: Język/strefa w węższej kolumnie + szerokie powiadomienia */}

                {/* Row 3: Bezpieczeństwo pełna szerokość */}
                <div className="md:col-span-12">
                  <SecuritySection />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save Bar component */}
      <SaveBar visible={isDirty} onSave={handleSave} onDiscard={handleDiscard} ping={saveBarPing} />

      {/* Leave confirmation modal */}
      <BaseModal
        isOpen={showLeaveConfirm}
        onClose={() => {
          setShowLeaveConfirm(false);
          blocker?.reset?.();
        }}
        title="Niezapisane zmiany"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowLeaveConfirm(false);
                blocker?.reset?.();
              }}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              Anuluj
            </button>
            <button
              onClick={handleDiscardAndLeave}
              className="px-4 py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50">
              Odrzuć i wyjdź
            </button>
            <button onClick={handleSaveAndLeave} className="px-4 py-2 rounded-md bg-primary text-white">
              Zapisz i wyjdź
            </button>
          </div>
        }>
        <p>Masz niezapisane zmiany. Czy chcesz je zapisać przed opuszczeniem strony?</p>
      </BaseModal>
    </div>
  );
}
