import EventModalContent from "@/components/ui/Calendar/Modal/EventModalContent";
import { useCalendarContext } from "@/context/CalendarContext";
import { useEffect, useRef } from "react";

export default function EventModal() {
  const { calendarClickContent, modalPosition, setCalendarClickContent } = useCalendarContext();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setCalendarClickContent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  if (!calendarClickContent || !modalPosition) return null;

  return (
    <div
      ref={modalRef}
      style={{ top: modalPosition.top, left: modalPosition.left }}
      className="absolute z-9999 bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-lg shadow-2xl px-3 pb-2 min-w-[20rem] max-w-[20rem]">
      <button
        onClick={() => setCalendarClickContent(null)}
        className="absolute top-0 right-3 text-red-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
        ✕
      </button>
      <EventModalContent />
    </div>
  );
}
