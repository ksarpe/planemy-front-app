import type { TutorialStep } from "@/context/TutorialContext";

export const calendarTutorialSteps: TutorialStep[] = [
  {
    target: "#add-event-button",
    title: "Add New Event",
    content: "Click here to create a new event. You can set the title, time, location, and more.",
    position: "auto", // Auto will choose best position
  },
  {
    target: "#calendar-navigation",
    title: "Navigate Months",
    content: "Use these arrows to move between months and view your schedule over time.",
    position: "auto",
  },
  {
    target: "#view-switcher",
    title: "Change View",
    content: "Switch between month, week, and day views to see your calendar in different formats.",
    position: "auto",
  },
];

export const tasksTutorialSteps: TutorialStep[] = [
  {
    target: "#tasks-view",
    title: "Welcome to Tasks",
    content: "Here you can manage all your tasks and to-do items efficiently.",
    position: "bottom",
  },
  {
    target: "#add-task-button",
    title: "Create Task",
    content: "Click here to add a new task to your list.",
    position: "left",
  },
];

export const labelsTutorialSteps: TutorialStep[] = [
  {
    target: "#labels-view",
    title: "Welcome to Labels",
    content: "Labels help you organize and categorize your events and tasks.",
    position: "bottom",
  },
  {
    target: "#add-label-button",
    title: "Create Label",
    content: "Click here to create a new label with a custom name and color.",
    position: "left",
  },
  {
    target: "#label-list",
    title: "Manage Labels",
    content: "View and edit all your labels here. You can change colors, names, and descriptions.",
    position: "bottom",
  },
];

export const homeTutorialSteps: TutorialStep[] = [
  {
    target: "#home-view",
    title: "Welcome to AI Planner",
    content: "Your personal dashboard showing an overview of your schedule and tasks.",
    position: "bottom",
  },
  {
    target: "#upcoming-events",
    title: "Upcoming Events",
    content: "See your next events at a glance.",
    position: "left",
  },
  {
    target: "#quick-actions",
    title: "Quick Actions",
    content: "Access frequently used features quickly from here.",
    position: "bottom",
  },
];

// Map of route paths to tutorial steps
export const tutorialStepsMap: Record<string, TutorialStep[]> = {
  "/": homeTutorialSteps,
  "/calendar": calendarTutorialSteps,
  "/labels": labelsTutorialSteps,
};
