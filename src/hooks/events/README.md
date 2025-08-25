# Events Hooks

This folder contains hooks related to event management using TanStack Query.

## Available Hooks

### `useAddEvent`

Hook for adding new events to the calendar using TanStack Query mutations.

**Usage:**

```tsx
import { useAddEvent } from "@/hooks/events";

const MyComponent = () => {
  const { addEvent, isLoading, error, isSuccess, reset } = useAddEvent();

  const handleCreateEvent = async () => {
    try {
      const eventId = await addEvent({
        title: "New Event",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
        allDay: false,
        category: "Personal",
        displayType: "block",
        color: "#3b82f6",
        isRecurring: false,
        isPrivate: false,
        visibility: "private",
      });
      console.log("Event created with ID:", eventId);
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  return (
    <div>
      <button onClick={handleCreateEvent} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Event"}
      </button>
      {error && <p>Error: {error.message}</p>}
      {isSuccess && <p>Event created successfully!</p>}
    </div>
  );
};
```

**Returns:**

- `addEvent`: Async function to add a new event (returns Promise with event ID)
- `isLoading`: Boolean indicating if the mutation is in progress
- `error`: Error object if the mutation failed
- `isSuccess`: Boolean indicating if the mutation was successful
- `reset`: Function to reset the mutation state

**Features:**

- Automatically invalidates events queries after successful creation
- Shows success/error toasts
- Adds `userId` automatically from authenticated user
- Built with TanStack Query for optimistic updates and caching

**Note:** The hook automatically adds the `userId` from the authenticated user, so you don't need to include it in the event data.

## `useUpcomingEvents`

Hook for getting upcoming events grouped by time periods (today, tomorrow, this week).

**Usage:**

```tsx
import { useUpcomingEvents } from "@/hooks/events";

const MyComponent = () => {
  const { groups, totalEvents, hasEvents, nextEvent } = useUpcomingEvents();

  return (
    <div>
      {hasEvents ? (
        <div>
          <p>Total upcoming events: {totalEvents}</p>
          {nextEvent && (
            <div>
              <h3>Next Event:</h3>
              <p>{nextEvent.title}</p>
              <p>{new Date(nextEvent.start).toLocaleString()}</p>
            </div>
          )}

          {groups.map((group, index) => (
            <div key={index}>
              <h4>
                {group.title} ({group.dateRange})
              </h4>
              {group.events.map((event) => (
                <div key={event.id}>{event.title}</div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming events this week</p>
      )}
    </div>
  );
};
```

**Returns:**

- `groups`: Array of event groups (today, tomorrow, this week)
- `totalEvents`: Total number of upcoming events
- `hasEvents`: Boolean indicating if there are any upcoming events
- `nextEvent`: The next upcoming event (or null)

**Features:**

- Filters events from today through the end of the current week
- Groups events by time periods (today, tomorrow, rest of week)
- Sorts events chronologically
- Uses Polish locale for date formatting
