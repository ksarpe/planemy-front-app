# Dashboard Components

Ten folder zawiera komponenty używane w widoku Dashboard (`DashboardView`).

## Struktura komponentów

### StatsGrid

Wyświetla statystyki w formie kafelków:

- Dzisiejsze zadania
- Ukończone w tygodniu
- Nadchodzące płatności
- Powiadomienia

### TodaySchedule

Pokazuje harmonogram zadań na dziś z priorytetami (wysokie, średnie, niskie).

### RecentActivity

Wyświetla ostatnie aktywności użytkownika w aplikacji.

### UpcomingPayments

Lista nadchodzących płatności z informacją o terminach i statusach pilności.

### WeeklyProgress

Kołowy wskaźnik postępu zadań w tygodniu z procentowym uzupełnieniem.

### QuickActions

Panel szybkich akcji do tworzenia nowych elementów:

- Nowe zadanie
- Dodaj wydarzenie
- Lista zakupów
- Nowa płatność

## Użycie

Wszystkie komponenty są eksportowane z `index.ts` i mogą być importowane jako:

```tsx
import {
  StatsGrid,
  TodaySchedule,
  RecentActivity,
  UpcomingPayments,
  WeeklyProgress,
  QuickActions,
} from "@/components/ui/Dashboard";
```

## Dane

Obecnie wszystkie komponenty używają mockowych danych. W przyszłości będą zintegrowane z prawdziwymi API i kontekstami aplikacji.
