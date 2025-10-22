import { useEffect, useMemo, useState, useCallback } from "react";
import { RiArrowRightLine, RiCloseLine, RiDeleteBinLine } from "@remixicon/react";
import { format, isBefore } from "date-fns";
import { Button as AriaButton, DatePicker, Dialog, Group, Popover as AriaPopover } from "react-aria-components";
import { parseDate } from "@internationalized/date";

import type { CalendarEvent, EventColor } from "@/components/shadcn/types";
import { DefaultEndHour, DefaultStartHour, EndHour, StartHour } from "@/components/shadcn/constants";
import { cn } from "@/lib/shadcn/utils";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar as CalendarRAC } from "@/components/ui/shadcn/calendar-rac";
import { DateInput } from "@/components/ui/shadcn/datefield-rac";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Calendar } from "lucide-react";
import { Switch } from "@/components/ui/shadcn/switch";

interface EventPanelProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export function EventPanel({ event, isOpen, onClose, onSave, onDelete }: EventPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`);
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`);
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [color, setColor] = useState<EventColor>("sky");
  const [error, setError] = useState<string | null>(null);

  // Helper function to format time for input
  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Helper function to add minutes to a time string
  const addMinutesToTime = (timeString: string, minutesToAdd: number) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes + minutesToAdd;

    // Handle overflow past midnight
    if (totalMinutes >= 24 * 60) {
      totalMinutes = totalMinutes % (24 * 60);
    }

    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
  };

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    const defaultStart = `${DefaultStartHour}:00`;
    setStartTime(defaultStart);
    setEndTime(addMinutesToTime(defaultStart, 15)); // Set end time to 15 minutes after start
    setAllDay(false);
    setLocation("");
    setColor("sky");
    setError(null);
  }, []);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");

      const start = new Date(event.start);
      const end = new Date(event.end);

      setStartDate(start);
      setEndDate(end);
      setStartTime(formatTimeForInput(start));
      setEndTime(formatTimeForInput(end));
      setAllDay(event.allDay || false);
      setLocation(event.location || "");
      setColor((event.color as EventColor) || "sky");
      setError(null);
    } else {
      resetForm();
    }
  }, [event, resetForm]);

  // Handler for start time change - automatically updates end time
  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    // Automatically set end time to 15 minutes later
    const newEndTime = addMinutesToTime(newStartTime, 15);
    setEndTime(newEndTime);
  };

  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        const displayHour = hour % 12 || 12;
        const period = hour < 12 ? "AM" : "PM";
        const label = `${displayHour}:${formattedMinute} ${period}`;
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const start = new Date(startDate);
    start.setHours(startHours, startMinutes, 0, 0);

    const end = new Date(endDate);
    end.setHours(endHours, endMinutes, 0, 0);

    if (isBefore(end, start)) {
      setError("End time must be after start time");
      return;
    }

    const updatedEvent: CalendarEvent = {
      id: event?.id || "",
      title: title.trim(),
      description,
      start,
      end,
      allDay,
      location,
      color,
    };

    onSave(updatedEvent);
    onClose();
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-bg border-l border-bg-alt z-50",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-bg-alt">
          <h2 className="text-xl font-semibold text-text">{event?.id ? "Edit Event" : "Create Event"}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text hover:bg-bg-alt rounded-lg p-2 transition-colors"
            aria-label="Close panel">
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="rounded-lg px-3 py-2 text-sm bg-primary-light text-primary mb-4">{error}</div>}

          <div className="space-y-6">
            {/* Title */}
            <div className="group relative">
              <label
                htmlFor="title"
                className="cursor-text absolute top-1/2 -translate-y-1/2 px-1 text-sm text-text-muted/70 transition-all group-focus-within:top-0 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-text has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-text">
                <span className="inline-flex bg-bg px-2">Title</span>
              </label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="" autoFocus />
            </div>

            {/* Description */}
            <div className="group relative">
              <label
                htmlFor="description"
                className="origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-text-muted/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-text has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-text">
                <span className="inline-flex bg-bg px-2">Description</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder=" "
              />
            </div>

            {/* Date & Time Section */}
            <div className="space-y-3">
              {/* Dates Row */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {/* Start Date */}
                  <div className="flex-1">
                    <DatePicker
                      value={startDate ? parseDate(format(startDate, "yyyy-MM-dd")) : null}
                      onChange={(date) => {
                        if (date) {
                          const jsDate = new Date(date.year, date.month - 1, date.day);
                          setStartDate(jsDate);
                          if (isBefore(endDate, jsDate)) {
                            setEndDate(jsDate);
                          }
                          setError(null);
                        }
                      }}
                      className="group flex flex-col gap-1">
                      <Group className="flex w-full items-center rounded-lg border border-text-muted-more bg-bg hover:border-white px-3 py-2 text-xs transition-colors focus-within:border-ring">
                        <DateInput className="flex flex-1 text-text" unstyled />
                        <AriaButton className="ml-2 outline-none text-text-muted hover:text-white cursor-pointer">
                          <Calendar size={16} />
                        </AriaButton>
                      </Group>
                      <AriaPopover className="rounded-lg border border-text-muted-more bg-bg p-2 shadow-lg">
                        <Dialog className="outline-none">
                          <CalendarRAC />
                        </Dialog>
                      </AriaPopover>
                    </DatePicker>
                  </div>

                  {/* Arrow */}
                  <RiArrowRightLine size={16} className="text-text-muted shrink-0" />

                  {/* End Date */}
                  <div className="flex-1">
                    <DatePicker
                      value={endDate ? parseDate(format(endDate, "yyyy-MM-dd")) : null}
                      onChange={(date) => {
                        if (date) {
                          const jsDate = new Date(date.year, date.month - 1, date.day);
                          setEndDate(jsDate);
                          setError(null);
                        }
                      }}
                      minValue={startDate ? parseDate(format(startDate, "yyyy-MM-dd")) : undefined}
                      className="group flex flex-col gap-1">
                      <Group className="flex w-full items-center rounded-lg border border-text-muted-more hover:border-white bg-bg px-3 py-2 text-xs transition-colors focus-within:border-ring">
                        <DateInput className="flex flex-1 text-text" unstyled />
                        <AriaButton className="ml-2 outline-none text-text-muted hover:text-white cursor-pointer">
                          <Calendar size={16} />
                        </AriaButton>
                      </Group>
                      <AriaPopover className="rounded-lg border border-text-muted-more bg-bg p-2 shadow-lg">
                        <Dialog className="outline-none">
                          <CalendarRAC />
                        </Dialog>
                      </AriaPopover>
                    </DatePicker>
                  </div>
                </div>
              </div>

              {/* Times Row */}
              {
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {/* Start Time */}
                    <div className="flex-1">
                      <Select value={startTime} onValueChange={handleStartTimeChange} disabled={allDay}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Arrow */}
                    <RiArrowRightLine size={16} className="text-text-muted shrink-0" />

                    {/* End Time */}
                    <div className="flex-1">
                      <Select value={endTime} onValueChange={setEndTime} disabled={allDay}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              }
            </div>

            {/* All Day Switch */}
            <div className="flex items-center gap-2">
              <Switch id="all-day" checked={allDay} onCheckedChange={(checked) => setAllDay(checked === true)} />
              <Label htmlFor="all-day">All day</Label>
            </div>
            {/* Color */}
            <Button variant="default" onClick={() => {}}>
              + Add label
            </Button>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between p-6 border-t border-bg-alt bg-bg">
          {event?.id ? (
            <Button variant="default" onClick={handleDelete} className="text-red-500 hover:text-red-600">
              <RiDeleteBinLine size={24} />
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="primary">
              Save Event
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
