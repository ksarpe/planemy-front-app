import { useCalendarContext } from "@/context/CalendarContext";
import { EventInterface } from "@/data/types";
import EventBlock from "./EventBlock";

export default function DayEventsColumn({ events }: { events: EventInterface[] }) {
  const { setCalendarClickContent, setModalPosition } = useCalendarContext();
    const layoutedEvents = getLayoutedEvents(events);

  function getLayoutedEvents(events: EventInterface[]) {
    const layouted: { event: EventInterface; layout: { width: number; left: number; }; }[] = [];
    const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    for (let i = 0; i < sorted.length; i++) {
      const overlaps = [sorted[i]];

      for (let j = i + 1; j < sorted.length; j++) {
        const b = new Date(sorted[i].end).getTime();
        const c = new Date(sorted[j].start).getTime();

        if (c < b) {
          overlaps.push(sorted[j]);
        } else break;
      }

      overlaps.forEach((event, index) => {
        const layout = {
          width: 100 / overlaps.length,
          left: (100 / overlaps.length) * index,
        };
        if (index > 0) layout.left -= 10;
        layouted.push({ event, layout });
      });

      i += overlaps.length - 1; // Skip the processed events
    }

    return layouted;
  }


  const openEventModal = (e: React.MouseEvent, event: EventInterface) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setCalendarClickContent({ type: "event", data: event });
    setModalPosition({ top: rect.top + 20, left: rect.left + rect.width });
  };

  return (
    <div className="absolute top-0 left-0 right-2 bottom-0 pointer-events-none z-500">
      {layoutedEvents.map(({ event, layout }) => (
        <EventBlock key={event.id} event={event} layout={layout} onClick={openEventModal} />
      ))}
    </div>
  );
}
