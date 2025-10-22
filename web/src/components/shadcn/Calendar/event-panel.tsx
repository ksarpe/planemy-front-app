import { useEffect, useMemo, useState } from "react";
import { RiCalendarLine, RiCloseLine, RiDeleteBinLine } from "@remixicon/react";
import { format, isBefore } from "date-fns";

import type { CalendarEvent, EventColor } from "@/components/shadcn/types";
import { DefaultEndHour, DefaultStartHour, EndHour, StartHour } from "@/components/shadcn/constants";
import { cn } from "@/lib/shadcn/utils";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";
import { Textarea } from "@/components/ui/shadcn/textarea";

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
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

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
  }, [event]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(`${DefaultStartHour}:00`);
    setEndTime(`${DefaultEndHour}:00`);
    setAllDay(false);
    setLocation("");
    setColor("sky");
    setError(null);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
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

  const colorOptions = [
    { value: "sky", label: "Sky", bgClass: "bg-sky-500", borderClass: "border-sky-500" },
    { value: "pink", label: "Pink", bgClass: "bg-pink-500", borderClass: "border-pink-500" },
    { value: "green", label: "Green", bgClass: "bg-green-500", borderClass: "border-green-500" },
    { value: "purple", label: "Purple", bgClass: "bg-purple-500", borderClass: "border-purple-500" },
    { value: "orange", label: "Orange", bgClass: "bg-orange-500", borderClass: "border-orange-500" },
    { value: "yellow", label: "Yellow", bgClass: "bg-yellow-500", borderClass: "border-yellow-500" },
  ];

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
          "fixed top-0 right-0 h-full w-full sm:w-[500px] bg-bg border-l border-bg-alt z-50",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-bg-alt">
          <h2 className="text-xl font-semibold text-text">{event?.id ? "Edit Event" : "Create Event"}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text hover:bg-bg-alt rounded-md p-2 transition-colors"
            aria-label="Close panel">
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="rounded-md px-3 py-2 text-sm bg-primary-light text-primary mb-4">{error}</div>}

          <div className="space-y-6">
            {/* Title */}
            <div className="group relative">
              <label
                htmlFor="title"
                className="absolute top-1/2 -translate-y-1/2 px-1 text-sm text-text-muted/70 transition-all group-focus-within:top-0 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-text has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-text">
                <span className="inline-flex bg-bg px-2">Title *</span>
              </label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="" autoFocus />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Add description..."
              />
            </div>

            {/* Start Date & Time */}
            <div className="space-y-2">
              <Label>Start</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between px-3 font-normal bg-bg border-text-muted-more",
                          !startDate ? "text-text-muted" : "text-text",
                        )}>
                        <span className="truncate">{startDate ? format(startDate, "PPP") : "Pick a date"}</span>
                        <RiCalendarLine size={16} className="shrink-0 text-text-muted" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2 bg-bg border-text-muted-more" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        defaultMonth={startDate}
                        onSelect={(date) => {
                          if (date) {
                            setStartDate(date);
                            if (isBefore(endDate, date)) {
                              setEndDate(date);
                            }
                            setError(null);
                            setStartDateOpen(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {!allDay && (
                  <div className="w-32">
                    <Select value={startTime} onValueChange={setStartTime}>
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
                )}
              </div>
            </div>

            {/* End Date & Time */}
            <div className="space-y-2">
              <Label>End</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between px-3 font-normal bg-bg border-text-muted-more",
                          !endDate ? "text-text-muted" : "text-text",
                        )}>
                        <span className="truncate">{endDate ? format(endDate, "PPP") : "Pick a date"}</span>
                        <RiCalendarLine size={16} className="shrink-0 text-text-muted" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2 bg-bg border-text-muted-more" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        defaultMonth={endDate}
                        disabled={{ before: startDate }}
                        onSelect={(date) => {
                          if (date) {
                            setEndDate(date);
                            setError(null);
                            setEndDateOpen(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {!allDay && (
                  <div className="w-32">
                    <Select value={endTime} onValueChange={setEndTime}>
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
                )}
              </div>
            </div>

            {/* All Day Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox id="all-day" checked={allDay} onCheckedChange={(checked) => setAllDay(checked === true)} />
              <Label htmlFor="all-day">All day event</Label>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
              />
            </div>

            {/* Color */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-text">Color Label</legend>
              <RadioGroup className="flex gap-2" value={color} onValueChange={(value: EventColor) => setColor(value)}>
                {colorOptions.map((colorOption) => (
                  <RadioGroupItem
                    key={colorOption.value}
                    id={`color-${colorOption.value}`}
                    value={colorOption.value}
                    aria-label={colorOption.label}
                    className={cn("size-8 shadow-none", colorOption.bgClass, colorOption.borderClass)}
                  />
                ))}
              </RadioGroup>
            </fieldset>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between p-6 border-t border-bg-alt bg-bg">
          {event?.id ? (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <RiDeleteBinLine size={16} className="mr-2" />
              Delete
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Event</Button>
          </div>
        </div>
      </div>
    </>
  );
}
