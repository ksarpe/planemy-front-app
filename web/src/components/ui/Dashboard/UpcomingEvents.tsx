import { Calendar, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useUpcomingEvents } from "@shared/hooks/events";
import { useNavigate } from "react-router-dom";
import { useT } from "@shared/hooks/useT";

export default function UpcomingEvents() {
  const { groups, totalEvents, hasEvents, nextEvent } = useUpcomingEvents();
  const navigate = useNavigate();
  const { t } = useT();

  if (!hasEvents) {
    return (
      <div className="bg-bg rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            {t("dashboard.upcomingEvents")}
          </h3>
        </div>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{t("dashboard.noUpcomingEvents")}</p>
          <button
            onClick={() => navigate("/calendar")}
            className="mt-3 text-primary hover:text-primary/80 text-sm font-medium">
            {t("dashboard.addEvent")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg rounded-md p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text flex items-center">
          {t("dashboard.upcomingEvents")}
          <span className="ml-2 bg-primary-light text-primary text-sm font-bold px-2 py-1 rounded-full">
            {totalEvents}
          </span>
        </h3>
        <p className="text-xs text-primary cursor-pointer " onClick={() => navigate("/calendar")}>
          Przejdź do kalendarza
        </p>
      </div>
      <p className="text-sm text-text-muted mb-4">W kolejnych 2 miesiącach</p>

      {/* Next Event Highlight */}
      {nextEvent && (
        <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-primary font-medium mb-1">{t("dashboard.nextEvent")}</p>
              <h4 className="font-semibold text-text mb-1">{nextEvent.title}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {nextEvent.allDay
                  ? format(new Date(nextEvent.start), "EEEE, d MMMM", { locale: pl })
                  : format(new Date(nextEvent.start), "EEEE, d MMMM 'o' HH:mm", { locale: pl })}
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-primary" />
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
                  className="flex items-center justify-between p-3 bg-bg-alt rounded-md hover:bg-bg-hover transition-colors cursor-pointer"
                  onClick={() => navigate("/calendar")}>
                  <div className="flex items-center flex-1">
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0 bg-primary" />
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
                  className="w-full text-start py-2 text-sm text-primary hover:text-primary/80 font-medium">
                  {t("dashboard.seeMore", { count: group.events.length - 3 })}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
