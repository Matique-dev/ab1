import { ServiceType } from "./service";
import { Employee } from "./schedule";

// Core appointment interface
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

// Form data interface for appointment creation/editing
export interface AppointmentFormData {
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  selectedDate: string;
  serviceId?: string;
}

// Validation result interface
export interface AppointmentValidationResult {
  isValid: boolean;
  message?: string;
}

// Grid display configuration
export interface AppointmentGridConfig {
  hourHeight: number;
  startHour: number;
  pageMarginPercent: number;
}

// Column calculation result
export interface ColumnInfo {
  column: number;
  totalColumns: number;
}

// Position calculation result
export interface AppointmentPosition {
  top: number;
  height: number;
  left: string;
  width: string;
}

// View types
export type CalendarView = 'day' | 'week' | 'month';

// Notification types
export type NotificationType = 'business_hours' | 'employee_availability' | 'appointment_update';