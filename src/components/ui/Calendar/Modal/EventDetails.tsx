import EditableText from "@/components/ui/Utils/EditableText";
import { useCalendarContext } from "@/context/CalendarContext";
import { EventInterface, EventColor } from "@/data/types";
import { parseTimeToDateStr, getTimePart } from "@/utils/helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EventDetails({ event }: { event: EventInterface }) {
  const { updateEvent } = useCalendarContext();
  function changeColor(color: EventColor) {
    event.color = color; //TODO: api change color only 4 possible colors
    updateEvent(event);
  }
  return (
    <>
      {/* COLOR CHOOSE */}
      <div className="mt-2 flex gap-1">
        <button
          onClick={() => changeColor("bg-red-500")}
          className="w-4 h-4 bg-red-500 rounded-full cursor-pointer"
          title="Stressing"></button>
        <button
          onClick={() => changeColor("bg-blue-400")}
          className="w-4 h-4 bg-blue-400 rounded-full cursor-pointer"
          title="Easy"></button>
        <button
          onClick={() => changeColor("bg-green-500")}
          className="w-4 h-4 bg-green-500 rounded-full cursor-pointer"
          title="Important"></button>
        <button
          onClick={() => changeColor("bg-yellow-500")}
          className="w-4 h-4 bg-yellow-500 rounded-full cursor-pointer"
          title="Casual"></button>
      </div>
      <div className="flex flex-col gap-2 py-1">
        {/* TITLE ROW */}
        <EditableText
          value={event.title}
          onSave={(newValue: string) => {
            event.title = newValue.trim();
            updateEvent(event);
          }}
          className=""
        />

        <div className="text-sm text-gray-600 dark:text-gray-300">
          {!event.allDay ? (
            <>
              {/* HOURS ROW */}
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={new Date(event.start)}
                  onChange={(date) => {
                    if (!date) return;
                    event.start = parseTimeToDateStr(new Date(date), getTimePart(event.start));
                    updateEvent({ ...event });
                  }}
                  className="w-22 px-1 border focus:border-primary focus:outline-none text-sm hover:border hover:border-gray-300 border-transparent"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="HH:mm"
                />
                <span>→</span>
                <DatePicker
                  selected={new Date(event.end)}
                  onChange={(date) => {
                    if (!date) return;
                    event.start = parseTimeToDateStr(new Date(date), getTimePart(event.end));
                    updateEvent({ ...event });
                  }}
                  className="w-22 px-1 border focus:border-primary focus:outline-none text-sm hover:border hover:border-gray-300 border-transparent"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="HH:mm"
                />
                <span className="text-xs text-blue-400">
                  {Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60))} min
                </span>
              </div>
              {/* DATES ROW */}
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={new Date(event.start)}
                  onChange={(date) => {
                    if (!date) return;
                    event.start = parseTimeToDateStr(new Date(date), getTimePart(event.start));
                    updateEvent({ ...event });
                  }}
                  dateFormat="EEE, MMM d"
                  className="w-22 px-1 border focus:border-primary focus:outline-none text-sm hover:border hover:border-gray-300 border-transparent"
                />
                <span>→</span>
                <DatePicker
                  selected={new Date(event.end)}
                  onChange={(date) => {
                    if (!date) return;
                    event.end = parseTimeToDateStr(new Date(date), getTimePart(event.end));
                    updateEvent({ ...event });
                  }}
                  dateFormat="EEE, MMM d"
                  className="w-24 px-1 border focus:border-primary focus:outline-none text-sm hover:border hover:border-gray-300 border-transparent"
                />
              </div>
              {/* <span className="text-gray-400 text-xs">{navigator.language}</span> */}
            </>
          ) : (
            <div className="text-gray-400 text-sm">All-day event</div>
          )}
        </div>
      </div>
    </>
  );
}
