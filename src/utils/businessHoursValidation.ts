import { isWithinBusinessHours, isWithinExceptionHours } from "@/utils/appointmentValidation";
import { WeekSchedule } from "@/types/schedule";

type ExceptionDate = {
  date: Date;
  isAllDayOff: boolean;
  openTime?: string;
  closeTime?: string;
};

export const isHourAvailable = (
  hour: number,
  date: Date,
  businessHours: WeekSchedule,
  exceptionDates: ExceptionDate[]
) => {
  const time = `${hour.toString().padStart(2, '0')}:00`;
  const duration = "60";

  const exceptionCheck = isWithinExceptionHours(
    date,
    time,
    duration,
    exceptionDates
  );

  if (exceptionCheck.hasException) {
    return exceptionCheck.isValid;
  }

  const businessHoursCheck = isWithinBusinessHours(
    date,
    time,
    duration,
    businessHours
  );

  return businessHoursCheck.isValid;
};