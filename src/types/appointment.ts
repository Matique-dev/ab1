import { Employee } from "./schedule";
import { ServiceType } from "./service";

export interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
  serviceId?: string;
}

export interface FormData {
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  selectedDate: string;
  serviceId?: string;
}

export interface AppointmentValidationResult {
  isValid: boolean;
  message?: string;
}

// Constants for appointment settings
export const APPOINTMENT_DEFAULTS = {
  DEFAULT_DURATION: "60",
  DEFAULT_CLIENT_NAME: "Client name",
  DEFAULT_STYLIST: "anyone",
} as const;