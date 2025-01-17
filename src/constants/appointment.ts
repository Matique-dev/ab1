export const TIME_SLOTS = {
  MORNING_START: "09:00",
  EVENING_END: "17:00",
  LUNCH_START: "12:00",
  LUNCH_END: "13:00",
} as const;

export const DURATION_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
  { value: "120", label: "120 minutes" },
] as const;

export const VIEWS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
} as const;

export const NOTIFICATION_TYPES = {
  BUSINESS_HOURS: "business_hours",
  EMPLOYEE_AVAILABILITY: "employee_availability",
  APPOINTMENT_UPDATE: "appointment_update",
} as const;

export const DEFAULT_COLORS = {
  UNASSIGNED: "#6557FF",
  PRIMARY: "#AA3FFF",
  SECONDARY: "#F8522E",
  TERTIARY: "#2ECC71",
} as const;