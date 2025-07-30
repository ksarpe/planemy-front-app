// export function formatDateToYMD(date: Date) {
//   const padZero = (num: number) => num.toString().padStart(2, "0");
//   return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
// }

// export const formatDateStrToWdMD = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   });
// };

// export function getDatePart(dateStr: string): string {
//   return dateStr.split("T")[0];
// }

// export const stripTimePart = (date: Date): Date => {
//   return new Date(date.getFullYear(), date.getMonth(), date.getDate());
// };

// export function getTimePart(dateStr: string): string {
//   return dateStr.split("T")[1].slice(0, 5);
// }

// export const formatTimeToHM = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };

// export const parseTimeToDateStr = (dateBase: Date, timeString: string): string => {
//   const [hoursStr, minutesStr] = timeString.split(":");
//   const hours = parseInt(hoursStr, 10);
//   const minutes = parseInt(minutesStr, 10);

//   const result = new Date(dateBase);
//   result.setHours(hours, minutes, 0, 0);

//   const year = result.getFullYear();
//   const month = `${result.getMonth() + 1}`.padStart(2, "0");
//   const day = `${result.getDate()}`.padStart(2, "0");
//   const h = `${result.getHours()}`.padStart(2, "0");
//   const m = `${result.getMinutes()}`.padStart(2, "0");

//   return `${year}-${month}-${day}T${h}:${m}`;
// };

export const getDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// export const getDateKeyFromString = (date: string) => {
//   const dateObj = new Date(date);
//   const y = dateObj.getFullYear();
//   const m = `${dateObj.getMonth() + 1}`.padStart(2, "0");
//   const d = `${dateObj.getDate()}`.padStart(2, "0");
//   return `${y}-${m}-${d}`;
// };

// export const formatDateForUser = (date: Date, locale: string = navigator.language) =>
//   new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);

// export const formatDateStrForUser = (dateString: string, locale: string = navigator.language) => {
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
// };

