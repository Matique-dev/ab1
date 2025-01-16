import { WeekSchedule } from "@/types/schedule";

/**
 * Default business hours
 * @backend This will be stored in the database
 */
export const DEFAULT_BUSINESS_HOURS: WeekSchedule = {
  monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
  sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
};

/**
 * Service duration options in minutes
 * @frontend This should stay in the frontend for UI
 */
export const SERVICE_DURATION_OPTIONS = Array.from(
  { length: (120 - 5) / 5 + 1 },
  (_, i) => ({
    value: (i * 5 + 5).toString(),
    label: `${i * 5 + 5} min`,
  })
);