import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useUpcomingEvents } from "@shared/hooks/combined/useSummary";
import { useNavigate } from "react-router-dom";
import { useT } from "@shared/hooks/utils/useT";
import Spinner from "../Utils/Spinner";

export default function UpcomingEvents() {
  const { data, isLoading } = useUpcomingEvents();
  const navigate = useNavigate();
  const { t } = useT();

  const nextEvent = data?.nextEvent || null;
  const groups = data?.groups || [];

  return (
    <div className="bg-bg-alt dark:bg-bg-dark rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          {t("dashboard.upcomingEvents")}
          {data?.hasEvents && (
            <span className="ml-2 bg-primary-light text-primary text-sm font-bold px-2 py-1 rounded-full">
              {data?.totalEvents}
            </span>
          )}
        </h3>
        {data?.hasEvents && (
          <p className="text-xs text-primary cursor-pointer" onClick={() => navigate("/calendar")}>
            Przejdź do kalendarza
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : !data?.hasEvents ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{t("dashboard.noUpcomingEvents")}</p>
          <button
            onClick={() => navigate("/calendar")}
            className="mt-3 text-primary hover:text-primary/80 text-sm font-medium">
            {t("dashboard.addEvent")}
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-muted dark:text-text-muted-dark mb-4">W kolejnych 2 miesiącach</p>

          {/* Next Event Highlight */}
          {nextEvent && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-primary font-medium mb-1">{t("dashboard.nextEvent")}</p>
                  <h4 className="font-semibold text-text dark:text-text-dark mb-1">{nextEvent.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {/* {nextEvent.allDay
                      ? format(new Date(nextEvent.start), "EEEE, d MMMM", { locale: pl })
                      : format(new Date(nextEvent.start), "EEEE, d MMMM 'o' HH:mm", { locale: pl })} */}
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
                  <h4 className="text-sm font-medium text-text dark:text-text-dark">{group.title}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{group.dateRange}</span>
                </div>
                <div className="space-y-2">
                  {group.events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-bg-alt dark:bg-bg-alt-dark rounded-lg hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors cursor-pointer"
                      onClick={() => navigate("/calendar")}>
                      <div className="flex items-center flex-1">
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0 bg-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text dark:text-text-dark truncate">{event.title}</p>
                          {/* {!event.allDay && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                            </p>
                          )} */}
                          {event.description && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
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
        </>
      )}
    </div>
  );
}
