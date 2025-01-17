/**
 * Represents an appointment in the salon scheduling system.
 * @interface Appointment
 */
export interface Appointment {
  /** Unique identifier for the appointment */
  id: string;
  /** Name of the client */
  title: string;
  /** ID of the stylist assigned to the appointment. Use 'anyone' for unassigned */
  stylist: string;
  /** Time of the appointment in 24-hour format (HH:mm) */
  time: string;
  /** Duration of the appointment in minutes */
  duration: string;
  /** Indicates if this is a walk-in appointment */
  isWalkIn: boolean;
  /** Date of the appointment */
  date: Date;
  /** Optional ID of the service being provided */
  serviceId?: string;
}