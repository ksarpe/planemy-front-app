# Komponenty Common - Dokumentacja

## Przegląd

Folder `src/components/ui/Common` zawiera komponenty wielokrotnego użytku, które mogą być wykorzystywane w różnych częściach aplikacji.

## Komponenty

### BaseModal

Podstawowy komponent modalny, który służy jako fundament dla innych modali.

#### Props

```typescript
interface BaseModalProps {
  isOpen: boolean; // Czy modal jest otwarty
  onClose: () => void; // Funkcja zamykania modala
  title: string; // Tytuł modala
  children: ReactNode; // Zawartość modala
  showCloseButton?: boolean; // Czy pokazać przycisk X (domyślnie: true)
  maxWidth?: string; // Maksymalna szerokość (domyślnie: "w-96")
  actions?: ReactNode; // Przyciski akcji na dole modala
}
```

#### Przykład użycia

```tsx
import { BaseModal } from "@/components/ui/Common";

<BaseModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Tytuł modala"
  maxWidth="w-md"
  actions={
    <>
      <button onClick={onCancel}>Anuluj</button>
      <button onClick={onSave}>Zapisz</button>
    </>
  }>
  <p>Zawartość modala</p>
</BaseModal>;
```

### DeleteConfirmationModal

Specjalistyczny modal do potwierdzania usuwania elementów. Bazuje na BaseModal.

#### Props

```typescript
interface DeleteConfirmationModalProps {
  isOpen: boolean; // Czy modal jest otwarty
  onClose: () => void; // Funkcja zamykania
  onConfirm: () => void; // Funkcja potwierdzenia usunięcia
  title: string; // Tytuł modala
  message: string; // Główna wiadomość
  itemName: string; // Nazwa usuwanego elementu
  additionalInfo?: string; // Dodatkowe informacje (np. liczba elementów)
  confirmButtonText?: string; // Tekst przycisku potwierdzenia (domyślnie: "Usuń")
  cancelButtonText?: string; // Tekst przycisku anulowania (domyślnie: "Anuluj")
  isLoading?: boolean; // Czy trwa proces usuwania
}
```

#### Przykład użycia

```tsx
import { DeleteConfirmationModal } from "@/components/ui/Common";

<DeleteConfirmationModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDelete}
  title="Usuń zadanie"
  message="Czy na pewno chcesz usunąć zadanie"
  itemName={task.title}
  additionalInfo="Ta akcja jest nieodwracalna"
  isLoading={isDeleting}
/>;
```

## Korzyści

### 1. Konsystentność UI

- Wszystkie modale mają jednolity wygląd i zachowanie
- Standardowe animacje i style

### 2. Redukcja duplikacji kodu

- Wspólna logika modalowa w jednym miejscu
- Łatwiejsze utrzymanie i aktualizacje

### 3. Reużywalność

- Komponenty mogą być używane w różnych częściach aplikacji
- Łatwe do rozszerzenia o nowe funkcjonalności

### 4. Testowanie

- Łatwiejsze testowanie izolowanych komponentów
- Mniej powtarzającego się kodu testowego

## Zastosowanie w projekcie

### TaskListActions.tsx

Modal usuwania i zmiany nazwy list zadań zostały zrefaktoryzowane do używania nowych komponentów:

```tsx
// Poprzednio: ~50 linii HTML w komponencie
// Obecnie:
<DeleteConfirmationModal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Usuń listę zadań"
  message="Czy na pewno chcesz usunąć listę"
  itemName={currentTaskList.name}
  additionalInfo={`Liczba zadań, która zostanie usunięta: ${totalCount}`}
  confirmButtonText="Usuń listę"
  isLoading={loading}
/>
```

## Rozszerzanie

### Dodawanie nowych komponentów Common

1. Utwórz nowy plik w `src/components/ui/Common/`
2. Zaimplementuj komponent
3. Dodaj eksport do `index.ts`
4. Dodaj dokumentację tutaj

### Przykład nowego komponentu

```tsx
// SuccessModal.tsx
import BaseModal from "./BaseModal";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  autoClose?: number; // ms
}

export default function SuccessModal({ isOpen, onClose, title, message, autoClose }: SuccessModalProps) {
  // implementacja...
}
```

## Style i Animacje

Wszystkie komponenty używają:

- Tailwind CSS do stylowania
- Animacje fade-in/slide-in
- Responsywny design
- Dark mode support (gdy będzie implementowany)

## Accessibility

Komponenty zawierają:

- Proper ARIA labels
- Keyboard navigation (ESC to close)
- Focus management
- Screen reader support
