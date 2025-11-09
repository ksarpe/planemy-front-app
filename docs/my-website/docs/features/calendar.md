---
sidebar_position: 4
---

# Calendar

Event planning and scheduling.

## Features

- 📅 Create events
- ⏰ Set reminders
- 🔄 Recurring events
- 🏷️ Event labels

## API Hooks

```typescript
// Get events
const { data: events } = useEvents();

// Create event
const { mutate: createEvent } = useCreateEvent();
createEvent({
  title,
  start_time,
  end_time,
  description
});
```

## Calendar Views

- Month view
- Week view
- Day view
- Agenda list

## Integration

Uses FullCalendar library for web, React Native Calendars for mobile.
