export function formatHeaderTime(date) {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    month: "short", 
    day: "numeric",   
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
