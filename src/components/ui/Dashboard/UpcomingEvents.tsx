import { Calendar, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useUpcomingEvents } from "@/hooks/events";
import { useNavigate } from "react-router-dom";

export default function UpcomingEvents() {
  const { groups, totalEvents, hasEvents, nextEvent, hasNearEvents } = useUpcomingEvents();
  const navigate = useNavigate();

  if (!hasEvents) {
    return (
      <div className="bg-bg-alt rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Nadchodzące wydarzenia
          </h3>
        </div>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Brak nadchodzących wydarzeń w następnych dwóch miesiącach</p>
          <button
            onClick={() => navigate("/calendar")}
            className="mt-3 text-primary hover:text-primary/80 text-sm font-medium">
            Dodaj wydarzenie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-alt rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Nadchodzące wydarzenia
          <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
            {totalEvents}
          </span>
        </h3>
        <button
          onClick={() => navigate("/calendar")}
          className="text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Next Event Highlight */}
      {nextEvent && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-primary font-medium mb-1">Następne wydarzenie</p>
              <h4 className="font-semibold text-text mb-1">{nextEvent.title}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {nextEvent.allDay
                  ? format(new Date(nextEvent.start), "EEEE, d MMMM", { locale: pl })
                  : format(new Date(nextEvent.start), "EEEE, d MMMM 'o' HH:mm", { locale: pl })}
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: nextEvent.color || "#6b7280" }} />
          </div>
        </div>
      )}

      {/* Event Groups */}
      <div className="space-y-4">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-text">{group.title}</h4>
              <span className="text-xs text-gray-500">{group.dateRange}</span>
            </div>
            <div className="space-y-2">
              {group.events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-bg rounded-md hover:bg-bg-hover transition-colors cursor-pointer"
                  onClick={() => navigate("/calendar")}>
                  <div className="flex items-center flex-1">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 flex-shrink-0`}
                      style={{ backgroundColor: event.color || "#6b7280" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{event.title}</p>
                      {!event.allDay && (
                        <p className="text-xs text-gray-500">
                          {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                        </p>
                      )}
                      {event.description && <p className="text-xs text-gray-400 truncate mt-1">{event.description}</p>}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
              {group.events.length > 3 && (
                <button
                  onClick={() => navigate("/calendar")}
                  className="w-full text-center py-2 text-sm text-primary hover:text-primary/80 font-medium">
                  Zobacz {group.events.length - 3} więcej...
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate("/calendar")}
          className="w-full text-center py-2 text-sm text-primary hover:text-primary/80 font-medium">
          Zobacz wszystkie w kalendarzu
        </button>
      </div>
    </div>
  );
}
