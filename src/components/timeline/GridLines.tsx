import React from 'react';
import { isWithinBusinessHours, isWithinExceptionHours } from "@/utils/appointmentValidation";
import { useBusinessStore } from "@/hooks/useBusinessStore";

interface GridLinesProps {
  date: Date;
  hour: number;
  startHour: number;
  hourHeight: number;
}

export const GridLines = ({ date, hour, startHour, hourHeight }: GridLinesProps) => {
  const { businessHours, exceptionDates } = useBusinessStore();

  const isHourAvailable = (hour: number, date: Date) => {
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

  return (
    <React.Fragment>
      <div 
        className={`absolute w-full border-t border-gray-200 ${
          !isHourAvailable(hour, date) ? 
          'bg-[linear-gradient(135deg,transparent_46%,#e5e7eb_49%,#e5e7eb_51%,transparent_55%)] bg-[length:10px_10px]' : ''
        }`}
        style={{ 
          top: `${(hour - startHour) * hourHeight}px`,
          height: `${hourHeight}px`,
        }}
      />
      <div 
        className="absolute w-full border-t border-gray-200 opacity-50"
        style={{ 
          top: `${(hour - startHour) * hourHeight + hourHeight/2}px`,
        }}
      />
    </React.Fragment>
  );
};