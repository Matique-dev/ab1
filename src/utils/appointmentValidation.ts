import { WeekSchedule, Employee } from "@/types/schedule";
import { format, addMinutes, isBefore, isAfter, parseISO } from "date-fns";

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Check if time is within business hours
export const isWithinBusinessHours = (
  date: Date,
  time: string,
  duration: string,
  businessHours: WeekSchedule
): ValidationResult => {
  const dayOfWeek = format(date, 'EEEE').toLowerCase();
  const daySchedule = businessHours[dayOfWeek];
  
  if (!daySchedule.isOpen) {
    return { 
      isValid: false, 
      message: "Business is closed on this day" 
    };
  }

  const [appointmentHour, appointmentMinute] = time.split(':').map(Number);
  const [openHour, openMinute] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = daySchedule.closeTime.split(':').map(Number);

  const appointmentStart = new Date(date).setHours(appointmentHour, appointmentMinute);
  const businessOpen = new Date(date).setHours(openHour, openMinute);
  const businessClose = new Date(date).setHours(closeHour, closeMinute);

  // Calculate appointment end time
  const appointmentEnd = addMinutes(new Date(appointmentStart), parseInt(duration));

  if (appointmentStart < businessOpen || appointmentEnd.getTime() > businessClose) {
    return {
      isValid: false,
      message: "Appointment must be within business hours"
    };
  }

  return { isValid: true };
};

// Check if time is within exception dates
export const isWithinExceptionHours = (
  date: Date,
  time: string,
  duration: string,
  exceptionDates: Array<{
    date: Date;
    isAllDayOff: boolean;
    openTime?: string;
    closeTime?: string;
  }>
): ValidationResult => {
  const exceptionDate = exceptionDates.find(ex => 
    format(ex.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  if (!exceptionDate) {
    return { isValid: true };
  }

  if (exceptionDate.isAllDayOff) {
    return {
      isValid: false,
      message: "Business is closed on this day due to special hours"
    };
  }

  if (exceptionDate.openTime && exceptionDate.closeTime) {
    const [appointmentHour, appointmentMinute] = time.split(':').map(Number);
    const [openHour, openMinute] = exceptionDate.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = exceptionDate.closeTime.split(':').map(Number);

    const appointmentStart = new Date(date).setHours(appointmentHour, appointmentMinute);
    const exceptionOpen = new Date(date).setHours(openHour, openMinute);
    const exceptionClose = new Date(date).setHours(closeHour, closeMinute);

    const appointmentEnd = addMinutes(new Date(appointmentStart), parseInt(duration));

    if (appointmentStart < exceptionOpen || appointmentEnd.getTime() > exceptionClose) {
      return {
        isValid: false,
        message: "Appointment must be within special business hours"
      };
    }
  }

  return { isValid: true };
};

// Check employee availability
export const isEmployeeAvailable = (
  date: Date,
  time: string,
  duration: string,
  employee: Employee
): ValidationResult => {
  const dayOfWeek = format(date, 'EEEE').toLowerCase();
  const schedule = employee.schedule[dayOfWeek];

  if (!schedule.isAvailable) {
    return {
      isValid: false,
      message: `${employee.name} is not available on this day`
    };
  }

  const [appointmentHour, appointmentMinute] = time.split(':').map(Number);
  const [workStartHour, workStartMinute] = schedule.workStart.split(':').map(Number);
  const [workEndHour, workEndMinute] = schedule.workEnd.split(':').map(Number);
  const [lunchStartHour, lunchStartMinute] = schedule.lunchStart.split(':').map(Number);
  const [lunchEndHour, lunchEndMinute] = schedule.lunchEnd.split(':').map(Number);

  const appointmentStart = new Date(date).setHours(appointmentHour, appointmentMinute);
  const workStart = new Date(date).setHours(workStartHour, workStartMinute);
  const workEnd = new Date(date).setHours(workEndHour, workEndMinute);
  const lunchStart = new Date(date).setHours(lunchStartHour, lunchStartMinute);
  const lunchEnd = new Date(date).setHours(lunchEndHour, lunchEndMinute);

  const appointmentEnd = addMinutes(new Date(appointmentStart), parseInt(duration));

  if (appointmentStart < workStart || appointmentEnd.getTime() > workEnd) {
    return {
      isValid: false,
      message: `${employee.name}'s working hours are ${schedule.workStart} to ${schedule.workEnd}`
    };
  }

  if (appointmentStart < lunchEnd && appointmentEnd.getTime() > lunchStart) {
    return {
      isValid: false,
      message: `${employee.name} is on lunch break from ${schedule.lunchStart} to ${schedule.lunchEnd}`
    };
  }

  return { isValid: true };
};

// Check for scheduling conflicts
export const hasSchedulingConflicts = (
  date: Date,
  time: string,
  duration: string,
  employeeId: string,
  appointments: Array<{
    id?: string;
    date: Date;
    time: string;
    duration: string;
    stylist: string;
  }>,
  currentAppointmentId?: string
): ValidationResult => {
  const [appointmentHour, appointmentMinute] = time.split(':').map(Number);
  const appointmentStart = new Date(date).setHours(appointmentHour, appointmentMinute);
  const appointmentEnd = addMinutes(new Date(appointmentStart), parseInt(duration));

  const conflict = appointments.find(apt => {
    if (apt.id === currentAppointmentId) return false;
    if (apt.stylist !== employeeId) return false;
    if (format(apt.date, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd')) return false;

    const [existingHour, existingMinute] = apt.time.split(':').map(Number);
    const existingStart = new Date(apt.date).setHours(existingHour, existingMinute);
    const existingEnd = addMinutes(new Date(existingStart), parseInt(apt.duration));

    return (
      (appointmentStart >= existingStart && appointmentStart < existingEnd) ||
      (appointmentEnd > existingStart && appointmentEnd <= existingEnd) ||
      (appointmentStart <= existingStart && appointmentEnd >= existingEnd)
    );
  });

  if (conflict) {
    return {
      isValid: false,
      message: "This time slot conflicts with another appointment"
    };
  }

  return { isValid: true };
};