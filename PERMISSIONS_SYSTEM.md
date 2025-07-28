# Generyczny System Uprawnień

## Przegląd

Nowy generyczny system uprawnień umożliwia udostępnianie różnych typów obiektów (listy zadań, wydarzenia, listy zakupów) przy użyciu jednolitej struktury danych i API.

## Struktura Danych

### Permission Interface
```typescript
interface Permission {
  id?: string; // Firestore document ID
  object_id: string; // ID udostępnianego obiektu
  object_type: ShareableObjectType; // Typ obiektu ("task_list" | "event" | "shopping_list")
  user_id: string; // ID użytkownika z uprawnieniem
  role: SharePermission; // Poziom uprawnień ("view" | "edit" | "admin")
  granted_by: string; // ID użytkownika który udzielił uprawnień
  granted_at: string; // Czas udzielenia uprawnień (ISO string)
  accepted_at?: string; // Czas zaakceptowania zaproszenia
  status: "pending" | "accepted" | "rejected" | "revoked"; // Status zaproszenia
}
```

### ShareNotification Interface
```typescript
interface ShareNotification {
  id?: string;
  object_id: string;
  object_type: ShareableObjectType;
  object_name: string; // Nazwa obiektu do wyświetlenia
  shared_by: string;
  shared_with: string;
  permission: SharePermission;
  shared_at: string;
  status: "pending" | "accepted" | "rejected" | "revoked";
}
```

## Kolekcje Firebase

### `permissions` (Główna kolekcja)
Zawiera wszystkie uprawnienia dla wszystkich typów obiektów.

### Stare kolekcje (zachowane dla kompatybilności)
- `task_permissions` - stara kolekcja dla list zadań (deprecated)

## API Functions

### Główne funkcje (firebase/permissions.ts)

```typescript
// Udostępnianie obiektu
shareObjectWithUser(objectId, objectType, targetUserEmail, permission, sharedByUserId)

// Akceptowanie zaproszenia
acceptObjectInvitation(permissionId)

// Odrzucanie zaproszenia
rejectObjectInvitation(permissionId)

// Cofanie dostępu
revokeObjectAccess(objectId, objectType, userId)

// Pobieranie użytkowników z dostępem
getObjectSharedUsers(objectId, objectType)

// Nasłuchiwanie powiadomień
listenToUserPendingNotifications(userId, callback)

// Sprawdzanie dostępu
hasUserAccessToObject(userId, objectId, objectType)

// Pobieranie udostępnionych obiektów
getUserSharedObjects(userId, objectType)
```

### Funkcje specyficzne dla typów obiektów

#### Task Lists (firebase/taskPermissions.ts)
```typescript
shareTaskListWithUser(listId, targetUserEmail, permission, sharedByUserId)
acceptTaskListInvitation(notificationId)
rejectTaskListInvitation(notificationId)
revokeTaskListAccess(listId, userId)
getTaskListSharedUsers(listId)
listenToUserPendingNotifications(userId, callback) // Zwraca TaskListNotification[]
```

#### Events (firebase/eventPermissions.ts)
```typescript
shareEventWithUser(eventId, targetUserEmail, permission, sharedByUserId)
acceptEventInvitation(permissionId)
rejectEventInvitation(permissionId)
revokeEventAccess(eventId, userId)
getEventSharedUsers(eventId)
listenToUserPendingEventNotifications(userId, callback)
```

#### Shopping Lists (firebase/shoppingPermissions.ts)
```typescript
shareShoppingListWithUser(listId, targetUserEmail, permission, sharedByUserId)
acceptShoppingListInvitation(permissionId)
rejectShoppingListInvitation(permissionId)
revokeShoppingListAccess(listId, userId)
getShoppingListSharedUsers(listId)
listenToUserPendingShoppingNotifications(userId, callback)
```

## Komponenty UI

### UniversalShareNotifications
Uniwersalny komponent do wyświetlania powiadomień o udostępnieniu dla wszystkich typów obiektów.

```typescript
// src/components/ui/Utils/UniversalShareNotifications.tsx
import UniversalShareNotifications from "@/components/ui/Utils/UniversalShareNotifications";

// Używanie w głównym layoutcie
<UniversalShareNotifications />
```

### PendingSharesNotification (Legacy)
Komponent specyficzny dla list zadań, zachowany dla kompatybilności.

## Migracja

### Zaktualizowane pliki:
1. `src/data/types.ts` - dodano nowe interfejsy
2. `src/firebase/permissions.ts` - główny plik systemu uprawnień
3. `src/firebase/taskPermissions.ts` - adaptery dla list zadań
4. `src/firebase/eventPermissions.ts` - nowy plik dla wydarzeń
5. `src/firebase/shoppingPermissions.ts` - nowy plik dla list zakupów
6. `src/firebase/tasks.ts` - zaktualizowano hooki
7. `src/components/ui/Utils/UniversalShareNotifications.tsx` - nowy komponent

### Zmiany w hooks:
- `useUserTaskLists()` - używa teraz kolekcji `permissions` z filtrem `object_type === "task_list"`

## Jak używać

### 1. Udostępnianie obiektu
```typescript
// Lista zadań
await shareTaskListWithUser(listId, "user@example.com", "edit", currentUserId);

// Wydarzenie
await shareEventWithUser(eventId, "user@example.com", "view", currentUserId);

// Lista zakupów
await shareShoppingListWithUser(listId, "user@example.com", "edit", currentUserId);
```

### 2. Pobieranie udostępnionych obiektów
```typescript
// Wszystkie udostępnione listy zadań
const taskListIds = await getUserSharedObjects(userId, "task_list");

// Wszystkie udostępnione wydarzenia
const eventIds = await getUserSharedObjects(userId, "event");

// Wszystkie udostępnione listy zakupów
const shoppingListIds = await getUserSharedObjects(userId, "shopping_list");
```

### 3. Sprawdzanie uprawnień
```typescript
const { hasAccess, permission } = await hasUserAccessToObject(userId, objectId, "task_list");
if (hasAccess && permission === "edit") {
  // Użytkownik może edytować
}
```

## Kompatybilność

System jest w pełni kompatybilny wstecz:
- Istniejące komponenty dla list zadań działają bez zmian
- API dla list zadań pozostaje niezmienione
- Migracja danych następuje automatycznie podczas korzystania z nowych funkcji

## Rozszerzanie

Aby dodać nowy typ obiektu:

1. Dodaj nowy typ do `ShareableObjectType` w `types.ts`
2. Utwórz nowy plik `src/firebase/[objectType]Permissions.ts`
3. Zaimplementuj funkcje specyficzne dla typu
4. Dodaj obsługę w `getObjectName()` w `permissions.ts`
5. Dodaj ikonę i tekst w `UniversalShareNotifications.tsx`
