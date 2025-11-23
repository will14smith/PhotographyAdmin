export function formatDateTime(date?: Date): string {
    if (!date) return "N/A";
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date?: Date): string {
  if (!date) return "N/A";
  return date.toLocaleDateString();
}

export function formatDateRange(startDate?: Date, endDate?: Date): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === "N/A" && end === "N/A") return "No dates";
  if (start === end) return start;
  if (end === "N/A") return `From ${start}`;
  if (start === "N/A") return `Until ${end}`;
  
  return `${start} - ${end}`;
}
