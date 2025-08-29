import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      
      // Language & Region Section
      languageAndRegion: "Language and Region",
      language: "Language",
      timezone: "Timezone",
      polish: "Polish",
      english: "English",
      
      // Profile
      profileChangesDiscarded: "Changes discarded",
      profileChangesSaved: "Profile changes saved",
      loadingProfile: "Loading profile...",
      failedToSaveChanges: "Failed to save changes",
      
      // Dashboard
      upcomingPayments: "Upcoming Payments",
      noUpcomingPayments: "No upcoming payments",
      seeAllPayments: "See all payments",
      seeShoppingList: "See shopping list",
      seeAllTasks: "See all tasks",
      today: "Today",
      tomorrow: "Tomorrow",
      inDays: "In {{count}} days",
      urgent: "Urgent",
      soon: "Soon",
      ok: "OK",
      
      // Payments
      noPayments: "No payments",
      noOverduePayments: "No overdue payments",
      noPaymentsThisWeek: "No payments this week",
      addPayment: "Add payment",
      
      // Notifications
      noNewNotifications: "No new notifications or invitations",
      
      // Labels/Tags
      noLabels: "No labels",
      
      // Feedback
      seeWhatWeAreWorking: "See what we are working on and what has already been introduced to the application.",
    },
  },
  pl: {
    translation: {
      // Common
      save: "Zapisz",
      cancel: "Anuluj",
      delete: "Usuń",
      edit: "Edytuj",
      loading: "Ładowanie...",
      error: "Błąd",
      success: "Sukces",
      warning: "Ostrzeżenie",
      
      // Language & Region Section
      languageAndRegion: "Język i region",
      language: "Język",
      timezone: "Strefa czasowa",
      polish: "Polski",
      english: "English",
      
      // Profile
      profileChangesDiscarded: "Zmiany odrzucone",
      profileChangesSaved: "Zapisano zmiany profilu",
      loadingProfile: "Ładuję profil...",
      failedToSaveChanges: "Nie udało się zapisać zmian",
      
      // Dashboard
      upcomingPayments: "Nadchodzące płatności",
      noUpcomingPayments: "Brak nadchodzących płatności",
      seeAllPayments: "Zobacz wszystkie płatności",
      seeShoppingList: "Zobacz listę zakupów",
      seeAllTasks: "Zobacz wszystkie zadania",
      today: "Dzisiaj",
      tomorrow: "Jutro",
      inDays: "Za {{count}} dni",
      urgent: "Pilne",
      soon: "Wkrótce",
      ok: "OK",
      
      // Payments
      noPayments: "Brak płatności",
      noOverduePayments: "Brak przeterminowanych płatności",
      noPaymentsThisWeek: "Brak płatności w tym tygodniu",
      addPayment: "Dodaj płatność",
      
      // Notifications
      noNewNotifications: "Brak nowych powiadomień lub zaproszeń",
      
      // Labels/Tags
      noLabels: "Brak etykiet",
      
      // Feedback
      seeWhatWeAreWorking: "Zobacz nad czym pracujemy i co zostało już wprowadzone do aplikacji.",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pl", // Default to Polish as it seems to be the primary language
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      // Don't use browser language detection, let the app control language
      order: [],
      caches: [], // Don't cache language detection
    },
  });

export default i18n;