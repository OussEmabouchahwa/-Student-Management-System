/**
 * Formats a GPA value to two decimal places, or returns "Not graded" if absent.
 */
export function formatGpa(gpa: number | null | undefined): string {
  if (gpa === null || gpa === undefined || isNaN(gpa)) {
    return "Not graded";
  }
  return gpa.toFixed(2);
}

/**
 * Derives a consistent 4-digit number from any string id.
 */
function hashToFourDigits(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash) % 10000;
  return positive.toString().padStart(4, "0");
}

/**
 * Formats a student ID into the registrar's YYYY-NNNN standard.
 */
export function formatStudentNumber(id: string, createdAt?: string | Date): string {
  const date = createdAt ? new Date(createdAt) : new Date();
  const year = isNaN(date.getFullYear()) ? new Date().getFullYear() : date.getFullYear();
  const serial = hashToFourDigits(id || "0000");
  return `${year}-${serial}`;
}

/**
 * Formats an ISO date into standard sentence-case date display.
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Derives uppercase two-letter initials from first and last name.
 */
export function getInitials(firstName: string, lastName: string): string {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  return `${f}${l}` || "??";
}
