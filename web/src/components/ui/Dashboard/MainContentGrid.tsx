import { Badge } from "@/components/ui/Common/Badge";
import { type EventInterface } from "@shared/data/Calendar/events";
import { useLabelContext } from "@shared/hooks/context/useLabelContext";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

interface MainContentGridProps {
  tomorrow: Date;
  tomorrowEvents: EventInterface[];
  todayEvents: EventInterface[];
  next7DaysEvents: EventInterface[];
  next7DaysRange: { start: Date; end: Date };
}

export default function MainContentGrid({
  tomorrow,
  tomorrowEvents,
  todayEvents,
  next7DaysEvents,
  next7DaysRange,
}: MainContentGridProps) {
  const { getLabelForObject } = useLabelContext();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Today's Events - Most Prominent */}
      <div className="xl:col-span-2">
        <div className="p-6 rounded-xl bg-bg-primary border border-border shadow-md shadow-shadow space-y-6">
          {/* Today's Events - Main Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">Dziś</h2>
                <p className="text-sm text-text-muted">{format(new Date(), "EEEE, MMMM d", { locale: enUS })}</p>
              </div>
            </div>

            <div className="space-y-3">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => {
                  const eventLabel = getLabelForObject("event", event.id);
                  const startTime = format(new Date(event.starts_at), "HH:mm");
                  const endTime = event.ends_at ? format(new Date(event.ends_at), "HH:mm") : null;
                  let duration = "";
                  if (event.starts_at && event.ends_at) {
                    const diffMs = new Date(event.ends_at).getTime() - new Date(event.starts_at).getTime();
                    const diffMinutes = Math.round(diffMs / 60000);
                    if (diffMinutes >= 60) {
                      const hours = Math.floor(diffMinutes / 60);
                      const minutes = diffMinutes % 60;
                      duration = ` (${hours}h${minutes > 0 ? ` ${minutes}m` : ""})`;
                    } else {
                      duration = ` (${diffMinutes}m)`;
                    }
                  }

                  return (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 flex items-center gap-2 text-center">
                          <Clock className="w-4 h-4 text-text-muted" />
                          <span
                            className={`text-sm font-semibold text-text ${
                              event.ends_at && new Date(event.ends_at) < new Date() ? "line-through opacity-60" : ""
                            }`}>
                            {startTime}
                            {endTime && ` - ${endTime}`}
                            <span className="text-xs text-text-muted">{duration}</span>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-medium text-text group-hover:text-primary transition-colors ${
                              event.ends_at && new Date(event.ends_at) < new Date() ? "line-through opacity-60" : ""
                            }`}>
                            {event.title}
                          </h4>
                        </div>
                        {eventLabel && <Badge variant={eventLabel.color}>{eventLabel.label_name}</Badge>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events today</p>
                </div>
              )}
            </div>
          </div>

          {/* Tomorrow's Events - Secondary Section */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-text-muted" />
              <h3 className="text-sm font-semibold text-text-muted">Jutro</h3>
              <span className="text-xs text-text-muted">{format(tomorrow, "EEEE, MMMM d", { locale: enUS })}</span>
            </div>

            <div className="space-y-2">
              {tomorrowEvents.length > 0 ? (
                tomorrowEvents.map((event) => {
                  const eventLabel = getLabelForObject("event", event.id);
                  const eventTime = format(new Date(event.starts_at), "HH:mm");

                  return (
                    <div
                      key={event.id}
                      className="p-2.5 rounded-lg bg-bg-muted-light/50 border border-border/50 hover:border-border transition-colors cursor-pointer">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-text-muted">{eventTime}</span>
                          <span className="text-sm text-text-muted">{event.title}</span>
                        </div>
                        {eventLabel && (
                          <Badge size="sm" variant={eventLabel.color}>
                            {eventLabel.label_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-text-muted text-center py-3 opacity-60">No events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Next 7 Days - Match Left Panel Height */}
      <div>
        {/* Next 7 Days Events - Full Height */}
        <div className="p-5 rounded-xl bg-bg-primary border shadow-shadow border-border shadow-md h-full flex flex-col">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Następne 7 dni</h3>
            </div>
            <p className="text-xs text-text-muted">
              ({format(next7DaysRange.start, "MMM d", { locale: enUS })} -{" "}
              {format(next7DaysRange.end, "MMM d", { locale: enUS })})
            </p>
          </div>

          <div className="space-y-2 flex-1 items-center flex justify-center overflow-y-auto scrollbar-hide">
            {next7DaysEvents.length > 0 ? (
              next7DaysEvents.map((event) => {
                const eventLabel = getLabelForObject("event", event.id);
                const eventTime = format(new Date(event.starts_at), "HH:mm");
                const eventDate = format(new Date(event.starts_at), "EEE, MMM d", { locale: enUS });

                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-bg-secondary border border-border hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text-muted">{eventDate}</span>
                        <span className="text-xs font-medium text-text-muted">{eventTime}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-text">{event.title}</span>
                        {eventLabel && (
                          <Badge size="sm" variant={eventLabel.color}>
                            {eventLabel.label_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-text-muted text-center py-4">Brak wydarzeń</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
