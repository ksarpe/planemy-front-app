import { useState } from "react";
import { Calendar, Heart, Pill, Dumbbell, Coffee, Plus, X } from "lucide-react";
import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import { EventInterface } from "../../../data/types";

interface QuickEventCreatorProps {
  selectedDate?: Date;
  onClose?: () => void;
  className?: string;
}

export default function QuickEventCreator({ selectedDate, onClose, className = "" }: QuickEventCreatorProps) {
  const { addEvent } = useCalendarContext();
  const { user } = useAuthContext();
  const [isCreating, setIsCreating] = useState(false);

  const quickEvents = [
    {
      id: "period",
      title: "Period",
      icon: <Heart className="h-4 w-4" />,
      color: "bg-pink-500",
      description: "Monthly cycle tracking",
      template: {
        title: "Period",
        category: "Health" as const,
        displayType: "icon" as const,
        icon: "Circle",
        iconColor: "#ec4899",
        allDay: true,
        isRecurring: true,
        recurrence: {
          pattern: "monthly" as const,
          interval: 1,
          daysOfWeek: [],
        },
        isPrivate: true,
        visibility: "private" as const,
        healthData: {
          type: "period" as const,
          notes: "Regular cycle tracking",
        },
      },
    },
    {
      id: "medication",
      title: "Medication",
      icon: <Pill className="h-4 w-4" />,
      color: "bg-blue-500",
      description: "Daily medication reminder",
      template: {
        title: "Medication",
        category: "Health" as const,
        displayType: "icon" as const,
        icon: "Pill",
        iconColor: "#3b82f6",
        allDay: false,
        isRecurring: true,
        recurrence: {
          pattern: "daily" as const,
          interval: 1,
          daysOfWeek: [],
        },
        healthData: {
          type: "medication" as const,
          notes: "Daily medication reminder",
        },
      },
    },
    {
      id: "workout",
      title: "Workout",
      icon: <Dumbbell className="h-4 w-4" />,
      color: "bg-green-500",
      description: "Exercise session",
      template: {
        title: "Workout",
        category: "Fitness" as const,
        displayType: "standard" as const,
        icon: "Dumbbell",
        iconColor: "#10b981",
      },
    },
    {
      id: "coffee",
      title: "Coffee Break",
      icon: <Coffee className="h-4 w-4" />,
      color: "bg-amber-500",
      description: "Quick coffee break",
      template: {
        title: "Coffee Break",
        category: "Personal" as const,
        displayType: "standard" as const,
        allDay: false,
      },
    },
  ];

  const createQuickEvent = async (template: Partial<EventInterface> & { description?: string }) => {
    if (!user?.uid || !selectedDate) return;

    setIsCreating(true);

    try {
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);

      // Set default times based on event type
      if (!template.allDay) {
        switch (template.title) {
          case "Medication":
            startDate.setHours(8, 0, 0, 0);
            endDate.setHours(8, 15, 0, 0);
            break;
          case "Workout":
            startDate.setHours(18, 0, 0, 0);
            endDate.setHours(19, 0, 0, 0);
            break;
          case "Coffee Break":
            startDate.setHours(15, 0, 0, 0);
            endDate.setHours(15, 15, 0, 0);
            break;
          default:
            startDate.setHours(9, 0, 0, 0);
            endDate.setHours(10, 0, 0, 0);
        }
      } else {
        // For period tracking, create 5-day duration
        if (template.title === "Period") {
          endDate.setDate(endDate.getDate() + 4);
        }
      }

      const eventData: Omit<EventInterface, "id" | "createdAt" | "updatedAt"> = {
        title: template.title || "Event",
        category: template.category || "Other",
        allDay: template.allDay || false,
        isRecurring: template.isRecurring || false,
        isPrivate: template.isPrivate || false,
        visibility: template.visibility || "public",
        ...template,
        start: template.allDay ? startDate.toISOString().split("T")[0] : startDate.toISOString(),
        end: template.allDay ? endDate.toISOString().split("T")[0] : endDate.toISOString(),
        color: template.color || getCategoryColor(template.category || "Other"),
        userId: user.uid,
        description: template.description,
      };

      await addEvent(eventData);
      onClose?.();
    } catch (error) {
      console.error("Failed to create quick event:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Health: "bg-pink-500",
      Fitness: "bg-green-500",
      Personal: "bg-purple-500",
      Work: "bg-blue-500",
      Other: "bg-gray-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Quick Add
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {selectedDate && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {selectedDate.toLocaleDateString("en", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {quickEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => createQuickEvent(event.template)}
            disabled={isCreating || !selectedDate}
            className={`
              ${event.color} text-white p-3 rounded-md text-left transition-all
              hover:shadow-md hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              flex flex-col items-start space-y-1
            `}>
            <div className="flex items-center space-x-2">
              {event.icon}
              <span className="font-medium text-sm">{event.title}</span>
            </div>
            <span className="text-xs text-white/80">{event.description}</span>
          </button>
        ))}
      </div>

      {isCreating && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span>Creating event...</span>
        </div>
      )}
    </div>
  );
}
