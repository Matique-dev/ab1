import { Employee } from "@/types/schedule";
import { DEFAULT_BUSINESS_HOURS } from "@/constants/business";
import { defaultServices } from "@/types/service";

// Default manager employee with schedule based on business hours
export const defaultManager: Employee = {
  id: "manager",
  name: "Manager",
  color: "#6557FF",
  schedule: Object.keys(DEFAULT_BUSINESS_HOURS).reduce((acc, day) => ({
    ...acc,
    [day]: {
      isAvailable: DEFAULT_BUSINESS_HOURS[day].isOpen,
      workStart: DEFAULT_BUSINESS_HOURS[day].openTime,
      workEnd: DEFAULT_BUSINESS_HOURS[day].closeTime,
      lunchStart: "12:00",
      lunchEnd: "13:00"
    }
  }), {})
};

export const initialStoreValues = {
  employees: [defaultManager],
  services: defaultServices,
  businessHours: DEFAULT_BUSINESS_HOURS,
  exceptionDates: [],
};