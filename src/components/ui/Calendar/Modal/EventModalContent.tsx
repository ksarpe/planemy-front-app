import AdditionalData from "@/components/ui/Calendar/Modal/AdditionalData";
import EventDetails from "@/components/ui/Calendar/Modal/EventDetails";
import { useCalendarContext } from "@/context/CalendarContext";
import { EventInterface } from "@/data/types";

export default function EventModalContent() {
  const { calendarClickContent } = useCalendarContext();
  if (!calendarClickContent) return null;
  const additionalData = calendarClickContent.additionalData || null;

  const renderContent = () => {
    switch (calendarClickContent.type) {
      case "date":
        if (calendarClickContent.data instanceof Date) {
          return (
            <>
              <p className="text-sm font-medium mt-2">📅 {calendarClickContent.data.toDateString()}</p>
              <AdditionalData additionalData={additionalData} />
            </>
          );
        }
        return null;
      case "event":
        return (
          <>
            <span className="text-xs text-gray-400">Click field to edit</span>
            <EventDetails event={calendarClickContent.data as EventInterface} />
          </>
        );
    }
  };

  return <>{renderContent()}</>;
}
