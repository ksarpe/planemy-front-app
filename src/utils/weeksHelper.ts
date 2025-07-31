// Function to get the week starting from a given date
export function getWeek(startDate: Date): Date[] {
  const start = new Date(startDate);
  const dayOfWeek = start.getDay(); // 0 = niedziela, 1 = poniedziałek, ...

  // Przesuń do poniedziałku
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  start.setDate(start.getDate() + diffToMonday);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    week.push(day);
  }

  return week;
}

//Function to get months that are visible in the MONTH VIEW to determine the months shown in the header
export function getVisibleMonthsInWeek(currentDate: Date): string[] {
  const months = new Set<string>();
  for (const day of getWeek(currentDate)) {
    const month = day.toLocaleString("en", { month: "long" });
    months.add(month);
  }

  return Array.from(months);
}
