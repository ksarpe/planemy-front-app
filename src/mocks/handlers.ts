// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import type { EventInterface } from "@/data/types"; //There is HolidayEvent interface

export const handlers = [
  //PERIOD
  http.get("/api/period", () => {
    return HttpResponse.json({
      periods: [
        "2025-07-12",
        "2025-07-13",
        "2025-07-14",
        "2025-07-15",
        "2025-07-16",
        "2025-07-10",
        "2025-07-11",
        "2025-07-12",
        "2025-07-13",
        "2025-07-14",
      ],
      ovulation: ["2025-05-24", "2025-05-25", "2025-05-26"],
    });
  }),
  //EVENTS
  http.get("/api/events", async () => {
    return HttpResponse.json([
      //...(await getHolidays("PL", 2025)), //TODO Make it to save holidays when creating event database for user
      {
        id: 2,
        title: "Test2",
        category: "Important",
        start: "2025-07-21T11:05:00",
        end: "2025-07-21T13:30:00",
        allDay: false,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 9,
        title: "Test33",
        category: "Important",
        start: "2025-07-21T19:05:00",
        end: "2025-07-21T21:30:00",
        allDay: false,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 3,
        title: "Test3",
        category: "Meeting",
        start: "2025-07-15T10:15:00",
        end: "2025-07-21T11:30:00",
        allDay: false,
        classNames: "",
        color: "bg-green-400",
      },
      {
        id: 4,
        title: "Test4",
        category: "Important",
        start: "2025-07-15T10:30:00",
        end: "2025-07-15T11:30:00",
        allDay: false,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 5,
        title: "event 18-20",
        category: "Important",
        start: "2025-07-18",
        end: "2025-07-20",
        allDay: true,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 6,
        title: "event 20 - 21",
        category: "Important",
        start: "2025-07-20",
        end: "2025-07-21",
        allDay: true,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 7,
        title: "event 20 - 21 2",
        category: "Important",
        start: "2025-07-20",
        end: "2025-07-21",
        allDay: true,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 8,
        title: "Dwudniowe 22 - 23",
        category: "Important",
        start: "2025-07-22T15:30:00",
        end: "2025-07-23T12:30:00",
        allDay: false,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 9,
        title: "Dwudniowe 21 - 22",
        category: "Important",
        start: "2025-07-21",
        end: "2025-07-22",
        allDay: true,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 99,
        title: "Dwudniowe 21 - 22",
        category: "Important",
        start: "2025-07-21",
        end: "2025-07-22",
        allDay: true,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 10,
        title: "Dwudniowe 25 - 26",
        category: "Important",
        start: "2025-07-25",
        end: "2025-07-26",
        allDay: true,
        classNames: "",
        color: "bg-blue-400",
      },
      {
        id: 11,
        title: "22",
        category: "Important",
        start: "2025-07-22",
        end: "2025-07-22",
        allDay: true,
        classNames: "",
        color: "bg-blue-400",
      },
    ] as EventInterface[]);
  }),
  //TASKS
  http.get("/api/tasks", () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Posegregować śrubki",
        description: "",
        dueDate: "2025-07-20",
        completed: false,
      },
    ]);
  }),
  //Shopping lists
  http.get("/api/shopping-lists", () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Long-Term Wishlist",
        type: "longterm",
        items: [
          {
            id: 1,
            name: "Coffee Machine",
            recurring: false,
            bought: true,
            quantity: 1,
          },
          {
            id: 2,
            name: "Desk Lamp",
            recurring: false,
            bought: false,
            quantity: 1,
          },
          {
            id: 3,
            name: "Klawiatura i myszka",
            recurring: false,
            bought: true,
            quantity: 1,
          },
        ],
      },
      {
        id: 2,
        name: "Lidl Run",
        type: "recurring",
        items: [
          {
            id: 1,
            name: "Frozen Blueberries",
            recurring: true,
            bought: false,
            quantity: 1,
          },
          { id: 2, name: "Milk", recurring: false, bought: false, quantity: 2 },
        ],
      },
    ]);
  }),
  http.get("/api/shopping-lists/favourite-items", () => {
    return HttpResponse.json([
      { name: "Frozen Blueberries", quantity: 1 },
      { name: "Milk", quantity: 2 },
      { name: "Coffee Machine", quantity: 1 },
      { name: "Desk Lamp", quantity: 1 },
      { name: "Klawiatura i myszka", quantity: 1 },
    ]);
  }),
];
