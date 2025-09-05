# Onboarding Hooks Documentation

## Przegląd

Hooki do zarządzania procesem onboardingu użytkowników w aplikacji AI Planner. Używają TanStack Query dla optymalnego cache'owania i zarządzania stanem asynchronicznym.

## Hooki

### `useOnboardingStatus(userId: string | null)`

**Opis:** Hook do sprawdzania statusu onboardingu użytkownika.

**Parametry:**

- `userId: string | null` - ID użytkownika Firebase (hook jest wyłączony gdy `null`)

**Zwraca:** `UseQueryResult<{ isOnboarded: boolean }>`

**Przykład użycia:**

```tsx
import { useOnboardingStatus } from "@shared/hooks/onboarding/useOnboarding";

const MyComponent = ({ userId }: { userId: string }) => {
  const { data: status, isLoading, error } = useOnboardingStatus(userId);

  if (isLoading) return <div>Sprawdzam status...</div>;
  if (error) return <div>Błąd: {error.message}</div>;

  return <div>Status onboardingu: {status?.isOnboarded ? "Ukończony" : "Nieukończony"}</div>;
};
```

**Konfiguracja:**

- `queryKey: ['onboarding-status', userId]`
- `staleTime: 5 minut`
- `enabled: !!userId` (tylko gdy userId istnieje)

**Cachowanie:**

- Wyniki są cache'owane przez 5 minut
- Automatyczne odświeżanie w background
- Invalidacja po aktualizacji onboardingu

---

### `useCompleteOnboarding()`

**Opis:** Mutation hook do finalizacji procesu onboardingu.

**Parametry:** Brak

**Zwraca:** `UseMutationResult<UserProfile, Error, { userId: string; data: OnboardingData }>`

**Przykład użycia:**

```tsx
import { useCompleteOnboarding } from "@shared/hooks/onboarding/useOnboarding";
import { useToastContext } from "@shared/hooks/context/useToastContext";

const OnboardingForm = ({ userId }: { userId: string }) => {
  const { showToast } = useToastContext();
  const completeOnboarding = useCompleteOnboarding();

  const handleComplete = async () => {
    try {
      const result = await completeOnboarding.mutateAsync({
        userId,
        data: {
          nickname: "Jan",
          language: "pl",
          theme: "dark",
        },
      });

      showToast("success", "Onboarding ukończony!");
      console.log("Zaktualizowany profil:", result);
    } catch (error) {
      showToast("error", "Błąd podczas konfiguracji");
    }
  };

  return (
    <button onClick={handleComplete} disabled={completeOnboarding.isPending}>
      {completeOnboarding.isPending ? "Zapisuję..." : "Zakończ"}
    </button>
  );
};
```

**Automatyczne efekty:**

- Invaliduje cache `onboarding-status` po sukcesie
- Aktualizuje cache profilu użytkownika
- Loguje błędy do konsoli

---

### `useUpdateUserProfile()`

**Opis:** Mutation hook do aktualizacji profilu użytkownika podczas onboardingu.

**Parametry:** Brak

**Zwraca:** `UseMutationResult<UserProfile, Error, { userId: string; updates: Partial<UserProfile> }>`

**Przykład użycia:**

```tsx
import { useUpdateUserProfile } from "@shared/hooks/onboarding/useOnboarding";

const ProfileForm = ({ userId }: { userId: string }) => {
  const updateProfile = useUpdateUserProfile();

  const handleNicknameChange = async (nickname: string) => {
    try {
      const result = await updateProfile.mutateAsync({
        userId,
        updates: { nickname },
      });
      console.log("Profil zaktualizowany:", result);
    } catch (error) {
      console.error("Błąd aktualizacji:", error);
    }
  };

  return (
    <input
      type="text"
      onChange={(e) => handleNicknameChange(e.target.value)}
      disabled={updateProfile.isPending}
      placeholder="Twój nickname"
    />
  );
};
```

**Automatyczne efekty:**

- Aktualizuje cache profilu użytkownika
- Loguje błędy do konsoli

## Query Keys

### Struktura kluczy cache

```typescript
// Status onboardingu
['onboarding-status', userId: string]

// Profil użytkownika (aktualizowany przez mutations)
['user-profile', userId: string]
```

## Error Handling

### Rodzaje błędów

**Firebase błędy:**

- `permission-denied` - Brak uprawnień
- `not-found` - Dokument nie istnieje
- `unavailable` - Serwis niedostępny

**Aplikacyjne błędy:**

- `Failed to complete onboarding` - Ogólny błąd finalizacji
- `Failed to update user profile` - Błąd aktualizacji profilu

### Obsługa błędów

```tsx
import { FirebaseError } from "firebase/app";

const { error } = useOnboardingStatus(userId);

if (error) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return <div>Brak uprawnień</div>;
      case "unavailable":
        return <div>Serwis niedostępny, spróbuj później</div>;
      default:
        return <div>Błąd Firebase: {error.message}</div>;
    }
  }

  return <div>Nieoczekiwany błąd: {error.message}</div>;
}
```

## Performance

### Optymalizacje

**Cache'owanie:**

- `staleTime: 5 minut` dla statusu onboardingu
- Automatyczne odświeżanie w background
- Invalidacja tylko gdy potrzeba

**Mutations:**

- Optimistic updates dla lepszego UX
- Rollback przy błędach
- Automatyczne retry przy błędach sieci

### Monitoring

```tsx
import { useQueryClient } from "@tanstack/react-query";

// Sprawdzenie stanu cache
const queryClient = useQueryClient();
const cacheData = queryClient.getQueryData(["onboarding-status", userId]);
console.log("Cache status:", cacheData);

// Wymuszone odświeżenie
queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
```

## Debugging

### Przydatne komendy

```javascript
// Sprawdzenie cache w DevTools
window.ReactQueryDevtools?.openDevtools();

// Reset cache dla onboardingu
queryClient.removeQueries({ queryKey: ["onboarding-status"] });

// Sprawdzenie wszystkich query
console.log(queryClient.getQueryCache().getAll());
```

### Logi

Hooki automatycznie logują:

- Sukces operacji
- Błędy z kontekstem
- Parametry wywołań (w developmencie)

## Przykład integracji

```tsx
import React from "react";
import { useOnboardingStatus, useCompleteOnboarding } from "@shared/hooks/onboarding/useOnboarding";

const OnboardingExample: React.FC<{ userId: string }> = ({ userId }) => {
  // Stan onboardingu
  const { data: status, isLoading: checkingStatus, error: statusError } = useOnboardingStatus(userId);

  // Finalizacja onboardingu
  const completeOnboarding = useCompleteOnboarding();

  // Loading state
  if (checkingStatus) {
    return <div>Sprawdzam status onboardingu...</div>;
  }

  // Error state
  if (statusError) {
    return <div>Błąd: {statusError.message}</div>;
  }

  // Już onboarded
  if (status?.isOnboarded) {
    return <div>Onboarding został już ukończony!</div>;
  }

  // Potrzebny onboarding
  const handleComplete = async () => {
    try {
      await completeOnboarding.mutateAsync({
        userId,
        data: {
          nickname: "Test User",
          language: "pl",
          theme: "light",
        },
      });
    } catch (error) {
      console.error("Błąd onboardingu:", error);
    }
  };

  return (
    <div>
      <h1>Witaj w aplikacji!</h1>
      <button onClick={handleComplete} disabled={completeOnboarding.isPending}>
        {completeOnboarding.isPending ? "Kończy..." : "Zakończ onboarding"}
      </button>
    </div>
  );
};

export default OnboardingExample;
```

## Rozszerzanie

### Dodawanie nowych hooków

1. **Nowy hook:**

```tsx
export const useOnboardingStep = (userId: string, step: string) => {
  return useQuery({
    queryKey: ["onboarding-step", userId, step],
    queryFn: () => getOnboardingStep(userId, step),
    enabled: !!userId && !!step,
  });
};
```

2. **Nowa mutation:**

```tsx
export const useSkipOnboardingStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, step }: { userId: string; step: string }) => skipOnboardingStep(userId, step),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-status", variables.userId],
      });
    },
  });
};
```

### Best Practices

1. **Zawsze sprawdzaj enabled:**

```tsx
enabled: !!userId; // Unikaj niepotrzebnych wywołań
```

2. **Używaj odpowiednich stale times:**

```tsx
staleTime: 1000 * 60 * 5; // 5 minut dla rzadko zmieniających się danych
```

3. **Invaliduj cache po mutacjach:**

```tsx
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
};
```

4. **Loguj błędy z kontekstem:**

```tsx
onError: (error) => {
  console.error("Onboarding mutation failed:", error, variables);
};
```
