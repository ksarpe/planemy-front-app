# Onboarding API Documentation

## Przegląd

API do zarządzania procesem onboardingu użytkowników wykorzystujące Firebase Firestore jako bazę danych. Moduł zapewnia funkcje sprawdzania statusu onboardingu, finalizacji procesu oraz aktualizacji profilu użytkownika.

## Firebase Schema

### Kolekcja `users/{userId}`

```typescript
interface UserDocument {
  id: string; // Firebase User ID
  email?: string; // Email użytkownika
  displayName?: string; // Nazwa wyświetlana
  nickname?: string; // Nick wybrany podczas onboardingu
  photoURL?: string; // URL zdjęcia profilowego
  isOnboarded: boolean; // Status ukończenia onboardingu
  createdAt: string; // Data utworzenia (ISO)
  onboardingCompletedAt?: string; // Data ukończenia onboardingu (ISO)
  updatedAt: string; // Data ostatniej aktualizacji (ISO)
}
```

### Kolekcja `userSettings/{userId}`

```typescript
interface UserSettingsDocument {
  userId: string; // Firebase User ID
  theme: "light" | "dark"; // Wybrany motyw
  language: string; // Kod języka (pl, en, de, es)
  timezone?: string; // Strefa czasowa
  shareNotificationEnabled: boolean; // Powiadomienia o udostępnianiu
  defaultTaskListId?: string; // Domyślna lista zadań
  defaultShoppingListId?: string; // Domyślna lista zakupów
  colorThemeIndex?: number; // Indeks motywu kolorystycznego
  createdAt: string; // Data utworzenia (ISO)
  updatedAt: string; // Data ostatniej aktualizacji (ISO)
}
```

## Funkcje API

### `checkOnboardingStatus(userId: string)`

**Opis:** Sprawdza czy użytkownik ukończył proces onboardingu.

**Parametry:**

- `userId: string` - Firebase User ID

**Zwraca:** `Promise<{ isOnboarded: boolean }>`

**Logika:**

1. Pobiera dokument użytkownika z kolekcji `users`
2. Jeśli dokument nie istnieje, tworzy nowy z `isOnboarded: false`
3. Zwraca status `isOnboarded` (domyślnie `false`)

**Przykład użycia:**

```typescript
import { checkOnboardingStatus } from "@shared/api/onboarding";

const status = await checkOnboardingStatus("user123");
console.log("Is onboarded:", status.isOnboarded);
```

**Error Handling:**

- W przypadku błędu zawsze zwraca `{ isOnboarded: false }`
- Loguje błędy do konsoli
- Bezpieczne zachowanie - lepiej pokazać onboarding niepotrzebnie niż go pominąć

**Firebase Operations:**

```javascript
// Firestore operations used:
doc(db, "users", userId); // Reference do dokumentu
getDoc(userDocRef); // Pobranie dokumentu
setDoc(userDocRef, data); // Utworzenie dokumentu (jeśli nie istnieje)
```

---

### `completeOnboarding(userId: string, data: OnboardingData)`

**Opis:** Finalizuje proces onboardingu użytkownika i zapisuje zebrane dane.

**Parametry:**

- `userId: string` - Firebase User ID
- `data: OnboardingData` - Dane zebrane podczas onboardingu

**Zwraca:** `Promise<UserProfile>`

**Logika:**

1. Aktualizuje dokument użytkownika:
   - Ustawia `isOnboarded: true`
   - Zapisuje `nickname`
   - Dodaje timestamp `onboardingCompletedAt`
2. Jeśli podano preferencje (`language`, `theme`), aktualizuje/tworzy dokument w `userSettings`
3. Zwraca zaktualizowany profil użytkownika

**Przykład użycia:**

```typescript
import { completeOnboarding } from "@shared/api/onboarding";

const onboardingData = {
  nickname: "Jan Kowalski",
  language: "pl",
  theme: "dark" as const,
};

const profile = await completeOnboarding("user123", onboardingData);
console.log("Updated profile:", profile);
```

**Firebase Operations:**

```javascript
// Aktualizacja profilu użytkownika
updateDoc(userDocRef, {
  isOnboarded: true,
  nickname: data.nickname,
  onboardingCompletedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Utworzenie/aktualizacja ustawień (jeśli podano preferencje)
setDoc(settingsDocRef, settingsData, { merge: true });

// Pobranie zaktualizowanych danych
getDoc(userDocRef);
```

**Error Handling:**

- Rzuca `Error("Failed to complete onboarding")` przy błędzie
- Loguje szczegółowe błędy do konsoli
- Rollback nie jest zaimplementowany (Firebase atomic operations)

---

### `updateUserProfile(userId: string, updates: Partial<UserProfile>)`

**Opis:** Aktualizuje profil użytkownika podczas procesu onboardingu.

**Parametry:**

- `userId: string` - Firebase User ID
- `updates: Partial<UserProfile>` - Częściowe aktualizacje profilu

**Zwraca:** `Promise<UserProfile>`

**Logika:**

1. Aktualizuje dokument użytkownika z podanymi zmianami
2. Dodaje timestamp `updatedAt`
3. Zwraca zaktualizowany profil

**Przykład użycia:**

```typescript
import { updateUserProfile } from "@shared/api/onboarding";

const profile = await updateUserProfile("user123", {
  nickname: "Nowy Nick",
  displayName: "Jan Kowalski",
});
```

**Firebase Operations:**

```javascript
// Aktualizacja dokumentu
updateDoc(userDocRef, {
  ...updates,
  updatedAt: new Date().toISOString(),
});

// Pobranie zaktualizowanych danych
getDoc(userDocRef);
```

## Interfaces

### `OnboardingData`

```typescript
interface OnboardingData {
  nickname?: string; // Nick użytkownika
  language?: string; // Kod języka (pl, en, etc.)
  theme?: "light" | "dark"; // Motyw aplikacji
  timezone?: string; // Strefa czasowa
  notifications?: Partial<NotificationSettings>; // Ustawienia powiadomień
}
```

### `UserProfile`

```typescript
interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
  isOnboarded?: boolean;
  nickname?: string;
}
```

## Firebase Security Rules

**Rekomendowane reguły Firestore:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - dostęp tylko do własnego dokumentu
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User settings - dostęp tylko do własnych ustawień
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Monitoring i Debugging

### Logi

API automatycznie loguje:

```typescript
console.log("Checking onboarding status for user:", userId);
console.log("User onboarding status:", isOnboarded);
console.log("Completing onboarding for user:", userId, "with data:", data);
console.log("Onboarding completed successfully");
console.error("Error checking onboarding status:", error);
```

### Firebase Console

**Sprawdzanie danych:**

1. Otwórz [Firebase Console](https://console.firebase.google.com)
2. Wybierz projekt `budget-tracker-a96f3`
3. Przejdź do Firestore Database
4. Sprawdź kolekcje `users` i `userSettings`

**Przykład dokumentu użytkownika:**

```json
{
  "id": "firebase-user-id",
  "email": "user@example.com",
  "nickname": "Jan",
  "isOnboarded": true,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "onboardingCompletedAt": "2024-01-01T10:05:00.000Z",
  "updatedAt": "2024-01-01T10:05:00.000Z"
}
```

### Network Monitoring

W DevTools Networks tab sprawdź:

- Wywołania do Firebase (`firestore.googleapis.com`)
- Response times
- Error codes (403 = permission denied, 404 = not found)

## Error Codes

### Firebase Errors

| Kod                 | Opis                        | Rozwiązanie                                |
| ------------------- | --------------------------- | ------------------------------------------ |
| `permission-denied` | Brak uprawnień do dokumentu | Sprawdź Security Rules                     |
| `not-found`         | Dokument nie istnieje       | Normalny przypadek dla nowych użytkowników |
| `unavailable`       | Serwis Firebase niedostępny | Retry po czasie                            |
| `deadline-exceeded` | Timeout operacji            | Sprawdź połączenie                         |

### Aplikacyjne Errors

| Error Message                   | Przyczyna                | Rozwiązanie            |
| ------------------------------- | ------------------------ | ---------------------- |
| `Failed to complete onboarding` | Błąd podczas finalizacji | Sprawdź dane wejściowe |
| `Failed to update user profile` | Błąd aktualizacji        | Sprawdź uprawnienia    |

## Performance

### Optymalizacje

**Minimalne reads:**

- `checkOnboardingStatus` - 1 read (+ 1 write jeśli nowy user)
- `completeOnboarding` - 1 write + 1 write (settings) + 1 read
- `updateUserProfile` - 1 write + 1 read

**Indexing:** Firebase automatycznie indeksuje pola, ale możesz dodać composite indexes jeśli planujesz złożone zapytania.

**Caching:**

- TanStack Query cache'uje wyniki po stronie klienta
- Firebase SDK ma wbudowany offline cache

### Limits

**Firestore limits:**

- 1 write/second per document (wystarczające dla onboardingu)
- 10 MB max document size (znacznie więcej niż potrzeba)
- 1 MB max field size

## Testing

### Development Testing

```typescript
// Reset onboardingu dla testów
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@shared/api/config";

const resetOnboarding = async (userId: string) => {
  await updateDoc(doc(db, "users", userId), {
    isOnboarded: false,
    onboardingCompletedAt: null,
    updatedAt: new Date().toISOString(),
  });
};
```

### Unit Tests Example

```typescript
import { checkOnboardingStatus } from "@shared/api/onboarding";

// Mock Firebase
jest.mock("@shared/api/config", () => ({
  db: mockFirestore,
}));

describe("Onboarding API", () => {
  test("should return false for new user", async () => {
    const result = await checkOnboardingStatus("new-user");
    expect(result.isOnboarded).toBe(false);
  });

  test("should return true for completed user", async () => {
    // Setup mock with existing user
    const result = await checkOnboardingStatus("existing-user");
    expect(result.isOnboarded).toBe(true);
  });
});
```

## Migration Guide

### Z REST API na Firebase

Jeśli migrujjesz z RESTowego API:

**Przed:**

```typescript
const response = await fetch(`/api/users/${userId}/onboarding`);
const data = await response.json();
```

**Po:**

```typescript
const data = await checkOnboardingStatus(userId);
```

### Migracja danych

Jeśli masz istniejące dane w innej bazie:

```typescript
const migrateUserData = async (oldUserData: OldUserFormat) => {
  const newUserData: UserProfile = {
    id: oldUserData.id,
    email: oldUserData.email,
    nickname: oldUserData.username,
    isOnboarded: oldUserData.setup_completed,
    createdAt: oldUserData.created_at,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", oldUserData.id), newUserData);
};
```
