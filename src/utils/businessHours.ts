import { isSameDay } from "date-fns";

export type DaySchedule = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type WeekSchedule = {
  [key: string]: DaySchedule;
};

export type ExceptionDate = {
  date: Date;
  isAllDayOff: boolean;
  openTime?: string;
  closeTime?: string;
};

export const isWithinBusinessHours = (
  date: Date,
  time: string,
  weekSchedule: WeekSchedule,
  exceptionDates: ExceptionDate[]
): boolean => {
  // Check if it's an exception date
  const exceptionDate = exceptionDates?.find((ex) => isSameDay(ex.date, date));
  
  if (exceptionDate) {
    if (exceptionDate.isAllDayOff) return false;
    if (exceptionDate.openTime && exceptionDate.closeTime) {
      return isTimeWithinRange(time, exceptionDate.openTime, exceptionDate.closeTime);
    }
  }

  // Get day of week in lowercase
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const schedule = weekSchedule[dayOfWeek];

  if (!schedule || !schedule.isOpen) return false;
  return isTimeWithinRange(time, schedule.openTime, schedule.closeTime);
};

const isTimeWithinRange = (time: string, start: string, end: string): boolean => {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};