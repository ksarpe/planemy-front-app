export const dayStartOptions = Array.from({ length: 24 }, (_, hour) => {
  const label = `${hour.toString().padStart(2, "0")}:00`;
  return { label, value: label };
});

