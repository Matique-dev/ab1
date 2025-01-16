/**
 * Represents a time slot in 24-hour format (HH:mm)
 */
export type TimeSlot = string;

/**
 * Represents the schedule for a single day
 * @backend This will be stored in the database
 */
export type DaySchedule = {
  isAvailable: boolean;
  workStart: TimeSlot;
  workEnd: TimeSlot;
  lunchStart: TimeSlot;
  lunchEnd: TimeSlot;
};

/**
 * Represents the business operating hours for each day
 * @backend This will be stored in the database
 */
export type WeekSchedule = {
  [key: string]: {
    isOpen: boolean;
    openTime: TimeSlot;
    closeTime: TimeSlot;
  };
};

/**
 * Represents an employee and their schedule
 * @backend This will be stored in the database
 */
export interface Employee {
  id: string;
  name: string;
  color: string;
  schedule: {
    [key: string]: DaySchedule;
  };
}

/**
 * Constants for the application
 */
export const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
] as const;

/**
 * Default employee colors for consistent UI
 * @frontend This should stay in the frontend for UI consistency
 */
export const EMPLOYEE_COLORS = {
  DEFAULT: '#6557FF',
  SECONDARY: '#AA3FFF',
  TERTIARY: '#F8522E',
  QUATERNARY: '#2ECC71'
} as const;
