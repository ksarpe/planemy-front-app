# useLabels - Nowe hooki dla etykiet

## Przegląd

Stworzyłem nowy system hooków dla etykiet w stylu podobnym do `useTasks`. Wszystkie hooki używają React Query do zarządzania stanem i cache'owaniem.

## Dostępne hooki

### Pobieranie danych

```typescript
import { useLabels, useLabelConnections } from "@shared/hooks/labels";

// Pobieranie wszystkich etykiet użytkownika
const { data: labels, isLoading, error } = useLabels();

// Pobieranie połączeń etykiet
const labelConnectionsByType = useLabelConnections();
```

### Mutations (operacje CRUD)

```typescript
import {
  useCreateLabel,
  useUpdateLabel,
  useDeleteLabel,
  useBulkDeleteLabels,
  useCreateLabelConnection,
  useRemoveLabelConnection,
  useRemoveAllLabelConnections,
} from "@shared/hooks/labels";

// Tworzenie etykiety
const createLabel = useCreateLabel();
await createLabel.mutateAsync({
  name: "Ważne",
  color: "#ff0000",
  description: "Zadania o wysokim priorytecie",
});

// Aktualizacja etykiety
const updateLabel = useUpdateLabel();
await updateLabel.mutateAsync({
  labelId: "label-id",
  updates: { name: "Nowa nazwa" },
});

// Usuwanie etykiety
const deleteLabel = useDeleteLabel();
await deleteLabel.mutateAsync("label-id");

// Masowe usuwanie etykiet
const bulkDelete = useBulkDeleteLabels();
await bulkDelete.mutateAsync(["id1", "id2", "id3"]);

// Przypisywanie etykiety do obiektu
const createConnection = useCreateLabelConnection();
await createConnection.mutateAsync({
  objectId: "task-id",
  objectType: "task",
  labelId: "label-id",
});

// Usuwanie etykiety z obiektu
const removeConnection = useRemoveLabelConnection();
await removeConnection.mutateAsync({
  objectId: "task-id",
  objectType: "task",
  labelId: "label-id",
});

// Usuwanie wszystkich etykiet z obiektu
const removeAllConnections = useRemoveAllLabelConnections();
await removeAllConnections.mutateAsync({
  objectId: "task-id",
  objectType: "task",
});
```

## Zmiany w LabelContext

`LabelContext` został zaktualizowany, żeby używać nowych hooków. API pozostaje takie samo, więc komponenty korzystające z `useLabelContext()` nie wymagają zmian.

## Korzyści z migracji

1. **Konsistentność** - Wszystkie hooki teraz używają React Query
2. **Lepsze cache'owanie** - Automatyczne cache'owanie i synchronizacja
3. **Error handling** - Ujednolicone zarządzanie błędami
4. **Loading states** - Lepsze zarządzanie stanami ładowania
5. **Optymistic updates** - Możliwość dodania optymistycznych aktualizacji
6. **Background refetching** - Automatyczne odświeżanie w tle

## Stare vs nowe API

### Stare (zostało usunięte):

```typescript
// Usunięte z labels.ts:
const labels = useUserLabels(); // ❌
const connections = useLabelConnections(); // ❌
```

### Nowe:

```typescript
// Nowe hooki w hooks/labels/:
const { data: labels } = useLabels(); // ✅
const connections = useLabelConnections(); // ✅
const createLabel = useCreateLabel(); // ✅
// ... i inne
```

Wszystkie funkcje API (createLabel, updateLabel, itp.) pozostały bez zmian w `api/labels.ts`.
