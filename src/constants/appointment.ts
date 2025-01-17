// Time slots configuration
export const TIME_SLOTS = {
  MORNING_START: "09:00",
  EVENING_END: "17:00",
  LUNCH_START: "12:00",
  LUNCH_END: "13:00",
} as const;

// Duration options for appointments
export const DURATION_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
  { value: "120", label: "120 minutes" },
] as const;

// Calendar view options
export const VIEWS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
} as const;

// Notification types for the system
export const NOTIFICATION_TYPES = {
  BUSINESS_HOURS: "business_hours",
  EMPLOYEE_AVAILABILITY: "employee_availability",
  APPOINTMENT_UPDATE: "appointment_update",
} as const;

// Default color scheme
export const DEFAULT_COLORS = {
  UNASSIGNED: "#6557FF",
  PRIMARY: "#AA3FFF",
  SECONDARY: "#F8522E",
  TERTIARY: "#2ECC71",
} as const;

// Grid display configuration
export const GRID_CONFIG = {
  HOUR_HEIGHT: 100,
  START_HOUR: 9,
  PAGE_MARGIN_PERCENT: 10,
} as const;

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_TIME: "Selected time is outside business hours",
  INVALID_DATE: "Selected date is not available",
  STYLIST_UNAVAILABLE: "Selected stylist is not available at this time",
} as const;