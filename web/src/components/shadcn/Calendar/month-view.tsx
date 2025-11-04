"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { DraggableEvent } from "@/components/shadcn/Calendar/draggable-event";
import { DroppableCell } from "@/components/shadcn/Calendar/droppable-cell";
import { EventItem } from "@/components/shadcn/Calendar/event-item";
import { useEventVisibility } from "@/components/shadcn/Calendar/use-event-visibility";
import { DefaultStartHour, EventGap, EventHeight } from "@/components/shadcn/constants";
import { type CalendarEvent } from "@/components/shadcn/types";
import { getAllEventsForDay, getEventsForDay, getSpanningEventsForDay, sortEvents } from "@/components/shadcn/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

export function MonthView({ currentDate, events, onEventSelect, onEventCreate }: MonthViewProps) {
  // Generate extended date range - 3 months before and after current month
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);

    // Start 3 months before, end 3 months after
    const extendedStart = addDays(monthStart, -90);
    const extendedEnd = addDays(monthEnd, 90);

    const calendarStart = startOfWeek(extendedStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(extendedEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
      return format(date, "EEE");
    });
  }, []);

  const weeks = useMemo(() => {
    const result = [];
    let week = [];

    for (let i = 0; i < days.length; i++) {
      week.push(days[i]);
      if (week.length === 7 || i === days.length - 1) {
        result.push(week);
        week = [];
      }
    }

    return result;
  }, [days]);

  // Calculate initial offset to show current month
  const initialWeekOffset = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const weekOfCurrentMonth = weeks.findIndex((week) => week.some((day) => day && isSameDay(day, monthStart)));
    return Math.max(0, weekOfCurrentMonth);
  }, [currentDate, weeks]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  // State to track if mounted and which weeks to show
  const [isMounted, setIsMounted] = useState(false);
  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EventHeight,
    eventGap: EventGap,
  });

  const [weekOffset, setWeekOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);

  // How many weeks to display at once
  const VISIBLE_WEEKS = 5;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set initial offset to show current month when component mounts or month changes
  useEffect(() => {
    setWeekOffset(initialWeekOffset);
  }, [initialWeekOffset]);

  // Wheel event handler for week-by-week scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      // Throttle wheel events to prevent too rapid scrolling
      if (now - lastWheelTime.current < 300) return;
      lastWheelTime.current = now;

      const scrollDown = e.deltaY > 0;
      const maxOffset = weeks.length - VISIBLE_WEEKS;

      setWeekOffset((prev) => {
        if (scrollDown) {
          return Math.min(prev + 1, maxOffset);
        } else {
          return Math.max(prev - 1, 0);
        }
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [weeks.length]);

  // Get visible weeks based on offset
  const visibleWeeks = useMemo(() => {
    return weeks.slice(weekOffset, weekOffset + VISIBLE_WEEKS);
  }, [weeks, weekOffset, VISIBLE_WEEKS]);

  return (
    // Wrapper z cieniem i zaokrąglonymi rogami
    <div
      data-slot="month-view"
      className="flex flex-col flex-1 rounded-tl-2xl bg-bg-alt shadow-[-2px_-2px_6px] border border-bg-muted-light shadow-bg-muted-light overflow-auto">
      {/* ROW WITH WEEKDAYS NAMES */}
      <div className="grid grid-cols-7">
        {weekdays.map((day) => (
          <div key={day} className="py-2 text-center text-sm text-text-muted">
            {day}
          </div>
        ))}
      </div>
      {/* CALENDAR */}
      <div ref={containerRef} className="grid flex-1">
        {visibleWeeks.map((week, weekIndex) => (
          // Each week row
          <div key={`week-${weekOffset + weekIndex}`} className="grid grid-cols-7 [&:last-child>*]:border-b-0">
            {week.map((day, dayIndex) => {
              if (!day) return null; // Skip if day is undefined

              const dayEvents = getEventsForDay(events, day);
              const spanningEvents = getSpanningEventsForDay(events, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const cellId = `month-cell-${day.toISOString()}`;
              const allDayEvents = [...spanningEvents, ...dayEvents];
              const allEvents = getAllEventsForDay(events, day);

              const isReferenceCell = weekIndex === 0 && dayIndex === 0;
              const visibleCount = isMounted ? getVisibleEventCount(allDayEvents.length) : undefined;
              const hasMore = visibleCount !== undefined && allDayEvents.length > visibleCount;
              const remainingCount = hasMore ? allDayEvents.length - visibleCount : 0;

              return (
                //Actual DAY CELL
                <div key={day.toString()} className="border-r border-b border-bg-muted-light last:border-r-0">
                  <DroppableCell
                    id={cellId}
                    date={day}
                    onClick={() => {
                      const startTime = new Date(day);
                      startTime.setHours(DefaultStartHour, 0, 0);
                      onEventCreate(startTime);
                    }}>
                    <div
                      className={`mt-1 flex size-6 items-center justify-center ml-1 rounded-full text-sm ${
                        //TODAY & CURRENT/NOT MONTH STYLING
                        isToday(day)
                          ? "bg-primary font-bold text-white"
                          : isCurrentMonth
                          ? "text-text"
                          : "text-text-muted-more"
                      }`}>
                      {format(day, "d")}
                    </div>
                    <div
                      ref={isReferenceCell ? contentRef : null}
                      className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]">
                      {sortEvents(allDayEvents).map((event, index) => {
                        const eventStart = new Date(event.start);
                        const eventEnd = new Date(event.end);
                        const isFirstDay = isSameDay(day, eventStart);
                        const isLastDay = isSameDay(day, eventEnd);

                        const isHidden = isMounted && visibleCount && index >= visibleCount;

                        if (!visibleCount) return null;

                        if (!isFirstDay) {
                          return (
                            <div
                              key={`spanning-${event.id}-${day.toISOString().slice(0, 10)}`}
                              className="aria-hidden:hidden"
                              aria-hidden={isHidden ? "true" : undefined}>
                              <EventItem
                                onClick={(e) => handleEventClick(event, e)}
                                event={event}
                                view="month"
                                isFirstDay={isFirstDay}
                                isLastDay={isLastDay}>
                                <div className="invisible" aria-hidden={true}>
                                  {!event.allDay && <span>{format(new Date(event.start), "h:mm")} </span>}
                                  {event.title}
                                </div>
                              </EventItem>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={event.id}
                            className="aria-hidden:hidden"
                            aria-hidden={isHidden ? "true" : undefined}>
                            <DraggableEvent
                              event={event}
                              view="month"
                              onClick={(e) => handleEventClick(event, e)}
                              isFirstDay={isFirstDay}
                              isLastDay={isLastDay}
                            />
                          </div>
                        );
                      })}

                      {hasMore && (
                        <Popover modal>
                          <PopoverTrigger asChild>
                            <button
                              className="focus-visible:border-ring focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 mt-[var(--event-gap)] flex h-[var(--event-height)] w-full items-center overflow-hidden px-1 text-left text-[10px] backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] sm:px-2 sm:text-xs"
                              onClick={(e) => e.stopPropagation()}>
                              <span>
                                + {remainingCount} <span className="max-sm:sr-only">more</span>
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            className="max-w-52 p-3"
                            style={
                              {
                                "--event-height": `${EventHeight}px`,
                              } as React.CSSProperties
                            }>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">{format(day, "EEE d")}</div>
                              <div className="space-y-1">
                                {sortEvents(allEvents).map((event) => {
                                  const eventStart = new Date(event.start);
                                  const eventEnd = new Date(event.end);
                                  const isFirstDay = isSameDay(day, eventStart);
                                  const isLastDay = isSameDay(day, eventEnd);

                                  return (
                                    <EventItem
                                      key={event.id}
                                      onClick={(e) => handleEventClick(event, e)}
                                      event={event}
                                      view="month"
                                      isFirstDay={isFirstDay}
                                      isLastDay={isLastDay}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </DroppableCell>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
