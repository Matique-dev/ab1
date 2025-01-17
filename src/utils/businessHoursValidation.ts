import { isWithinBusinessHours, isWithinExceptionHours } from "@/utils/appointmentValidation";
import { ExceptionDate } from "@/types/schedule";

export const isHourAvailable = (
  hour: number,
  date: Date,
  businessHours: any,
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