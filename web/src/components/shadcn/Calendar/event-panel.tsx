import { parseDate } from "@internationalized/date";
import { RiArrowRightLine, RiDeleteBinLine } from "@remixicon/react";
import { format, isBefore } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button as AriaButton, Popover as AriaPopover, DatePicker, Dialog, Group } from "react-aria-components";

import { DefaultEndHour, DefaultStartHour, EndHour, StartHour } from "@/components/shadcn/constants";
import type { CalendarEvent, EventColor } from "@/components/shadcn/types";
import { Badge } from "@/components/ui/Common/Badge";
import { Drawer } from "@/components/ui/Common/Drawer";
import Multiselect from "@/components/ui/Common/Multiselect";
import { Button } from "@/components/ui/shadcn/button";
import { Calendar as CalendarRAC } from "@/components/ui/shadcn/calendar-rac";
import { DateInput } from "@/components/ui/shadcn/datefield-rac";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";
import { Switch } from "@/components/ui/shadcn/switch";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { useLabelContext } from "@shared/hooks/context/useLabelContext";
import { useSetLabelConnection } from "@shared/hooks/labels/useLabels";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

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
  const [color, setColor] = useState<EventColor>("cyan");
  const { labels, getLabelForObject } = useLabelContext();
  const { mutate: setLabelConnection } = useSetLabelConnection();

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
    setColor("cyan");
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
      toast.error("Title is required", { position: "bottom-center" });
      return;
    }

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const start = new Date(startDate);
    start.setHours(startHours, startMinutes, 0, 0);

    const end = new Date(endDate);
    end.setHours(endHours, endMinutes, 0, 0);

    if (isBefore(end, start)) {
      toast.error("End time must be after start time", { position: "bottom-center" });
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

  const newLabelAddAction = async (labelId: string) => {
    if (!event?.id) {
      toast.error("Save the event before adding labels.", { position: "bottom-center" });
      return;
    }
    setLabelConnection({ entity_id: event.id, entity_type: "event", label_id: labelId });
  };

  const labelsToSelect = labels.map((label) => ({ label: label.label_name, value: label.id, color: label.color }));
  const eventLabel = getLabelForObject("event", event?.id || "");

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={event?.id ? "Edit Event" : "Create Event"}
      // HEADER
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">{event?.id ? "Edit Event" : "Create Event"}</h2>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-2">
          {event?.id && (
            <Button variant="delete" onClick={handleDelete}>
              <RiDeleteBinLine size={24} />
            </Button>
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
      }>
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Title */}
          <Input id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />

          {/* Description */}
          <Textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          {/* Date & Time Section */}
          <div className="space-y-3">
            {/* Dates Row */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {/* Start Date */}
                <div className="flex-1">
                  <DatePicker
                    aria-label="Event Date Picker"
                    value={startDate ? parseDate(format(startDate, "yyyy-MM-dd")) : null}
                    onChange={(date) => {
                      if (date) {
                        const jsDate = new Date(date.year, date.month - 1, date.day);
                        setStartDate(jsDate);
                        if (isBefore(endDate, jsDate)) {
                          setEndDate(jsDate);
                        }
                      }
                    }}
                    className="group flex flex-col gap-1">
                    <Group className="flex w-full items-center rounded-2xl border border-bg-muted-light hover:border-text-muted-more focus-within:border-primary bg-bg-alt px-3 py-2 text-xs transition-colors">
                      <DateInput aria-label="Start Event Date Input" className="flex flex-1 text-text" unstyled />
                      <AriaButton className="ml-2 outline-none text-text-muted hover:text-white cursor-pointer">
                        <Calendar size={16} />
                      </AriaButton>
                    </Group>
                    <AriaPopover className="rounded-2xl border border-bg-muted-light bg-bg-alt p-2 shadow-lg">
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
                    aria-label="Event End Date Picker"
                    value={endDate ? parseDate(format(endDate, "yyyy-MM-dd")) : null}
                    onChange={(date) => {
                      if (date) {
                        const jsDate = new Date(date.year, date.month - 1, date.day);
                        setEndDate(jsDate);
                      }
                    }}
                    minValue={startDate ? parseDate(format(startDate, "yyyy-MM-dd")) : undefined}
                    className="group flex flex-col gap-1">
                    <Group className="flex w-full items-center rounded-2xl border border-bg-muted-light hover:border-text-muted-more focus-within:border-primary bg-bg-alt px-3 py-2 text-xs transition-colors">
                      <DateInput aria-label="End Event Date Input" className="flex flex-1 text-text" unstyled />
                      <AriaButton className="ml-2 outline-none text-text-muted hover:text-white cursor-pointer">
                        <Calendar size={16} />
                      </AriaButton>
                    </Group>
                    <AriaPopover className="rounded-2xl border border-bg-muted-light bg-bg-alt p-2 shadow-lg">
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
            <Label className={`${allDay ? "text-text font-bold" : "text-text-muted-more"} `}>All day</Label>
          </div>
          {/* CURRENT LABELS BADGES */}
          {event?.id && eventLabel && (
            <Badge size="lg" variant={eventLabel.color || "blue"}>
              {eventLabel?.label_name}
            </Badge>
          )}
          {/* LABEL SELECT */}
          {event?.id && (
            <Multiselect
              options={labelsToSelect}
              placeholder="Select label"
              openedPlaceholder="Search labels"
              addButtonText="Create label"
              onSelect={newLabelAddAction}
            />
          )}
        </div>
      </div>
    </Drawer>
  );
}
