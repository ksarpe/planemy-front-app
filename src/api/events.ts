import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";
import { EventInterface, RecurrenceRule } from "../data/types";
import { useAuthContext } from "../hooks/context/useAuthContext";

// Hook to get all events for current user
export const useEvents = (): EventInterface[] => {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.uid) return;

    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as EventInterface[];

      // Expand recurring events
      const expandedEvents = expandRecurringEvents(eventsData);
      setEvents(expandedEvents);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return events;
};

// Add a new event
export const addEvent = async (eventData: Omit<EventInterface, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (eventId: string, updates: Partial<EventInterface>): Promise<void> => {
  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "events", eventId));
    console.log("Event deleted:", eventId);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Delete recurring event series
export const deleteRecurringSeries = async (originalEventId: string, userId: string): Promise<void> => {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("userId", "==", userId), where("originalEventId", "==", originalEventId));

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

    // Also delete the original event
    await deleteDoc(doc(db, "events", originalEventId));
    await Promise.all(deletePromises);

    console.log("Recurring series deleted:", originalEventId);
  } catch (error) {
    console.error("Error deleting recurring series:", error);
    throw error;
  }
};

// Expand recurring events into individual instances
const expandRecurringEvents = (events: EventInterface[]): EventInterface[] => {
  const expandedEvents: EventInterface[] = [];
  const now = new Date();
  const futureLimit = new Date();
  futureLimit.setFullYear(futureLimit.getFullYear() + 2); // Expand 2 years into future

  events.forEach((event) => {
    if (!event.isRecurring || !event.recurrence) {
      expandedEvents.push(event);
      return;
    }

    // Generate recurring instances
    const instances = generateRecurringInstances(event, now, futureLimit);
    expandedEvents.push(...instances);
  });

  return expandedEvents;
};

// Generate recurring event instances
const generateRecurringInstances = (baseEvent: EventInterface, startDate: Date, endDate: Date): EventInterface[] => {
  const instances: EventInterface[] = [];
  const { recurrence } = baseEvent;

  if (!recurrence) return [baseEvent];

  const eventStart = new Date(baseEvent.start);
  const eventEnd = new Date(baseEvent.end);
  const duration = eventEnd.getTime() - eventStart.getTime();

  let currentDate = new Date(eventStart);
  let instanceCount = 0;

  // Ensure we start from a reasonable date
  if (currentDate < startDate) {
    currentDate = new Date(startDate);
  }

  while (currentDate <= endDate && instanceCount < 1000) {
    // Safety limit
    // Check if we've reached count limit
    if (recurrence.count && instanceCount >= recurrence.count) break;

    // Check if we've reached end date
    if (recurrence.endDate && currentDate > new Date(recurrence.endDate)) break;

    // Check if this date is in exceptions
    const dateStr = currentDate.toISOString().split("T")[0];
    if (recurrence.exceptions?.includes(dateStr)) {
      currentDate = getNextRecurrenceDate(currentDate, recurrence);
      continue;
    }

    // Create instance
    const instanceStart = new Date(currentDate);
    const instanceEnd = new Date(currentDate.getTime() + duration);

    instances.push({
      ...baseEvent,
      id: `${baseEvent.id}_${instanceCount}`,
      start: instanceStart.toISOString(),
      end: instanceEnd.toISOString(),
      originalEventId: baseEvent.id,
    });

    instanceCount++;
    currentDate = getNextRecurrenceDate(currentDate, recurrence);
  }

  return instances;
};

// Calculate next occurrence date based on recurrence pattern
const getNextRecurrenceDate = (currentDate: Date, recurrence: RecurrenceRule): Date => {
  const nextDate = new Date(currentDate);

  switch (recurrence.pattern) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + recurrence.interval);
      break;

    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7 * recurrence.interval);
      break;

    case "biweekly":
      nextDate.setDate(nextDate.getDate() + 14);
      break;

    case "monthly":
      if (recurrence.monthlyType === "date") {
        nextDate.setMonth(nextDate.getMonth() + recurrence.interval);
      } else {
        // Handle "day" type (e.g., 3rd Monday of month)
        nextDate.setMonth(nextDate.getMonth() + recurrence.interval);
      }
      break;

    case "quarterly":
      nextDate.setMonth(nextDate.getMonth() + 3 * recurrence.interval);
      break;

    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + recurrence.interval);
      break;

    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate;
};

// Helper function to create period tracking events
export const createPeriodEvent = async (
  startDate: string,
  durationDays: number = 5,
  userId: string,
): Promise<string> => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);

  const periodEvent: Omit<EventInterface, "id" | "createdAt" | "updatedAt"> = {
    title: "Period",
    description: "Monthly period tracking",
    category: "Health",
    start: start.toISOString(),
    end: end.toISOString(),
    allDay: true,
    color: "bg-pink-500",
    icon: "Circle",
    iconColor: "#ec4899",
    isRecurring: true,
    recurrence: {
      pattern: "monthly",
      interval: 1,
      monthlyType: "date",
    },
    isPrivate: true,
    visibility: "private",
    userId,
  };

  return await addEvent(periodEvent);
};
