import React from 'react';
import { format } from "date-fns";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { isWithinBusinessHours, isWithinExceptionHours } from "@/utils/appointmentValidation";

interface TimeGridProps {
  hours: number[];
  startHour: number;
  hourHeight: number;
  mode?: 'day' | 'week';
  dates?: Date[];
}

export const TimeGrid = ({ hours, startHour, hourHeight, mode = 'day', dates = [] }: TimeGridProps) => {
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
    <div className="timeline-layout">
      {/* Column headers for week view */}
      {mode === 'week' && dates.length > 0 && (
        <div className="sticky top-0 bg-white z-20 ml-16 border-b border-gray-200">
          <div className="grid grid-cols-7 h-10">
            {dates.map((date) => (
              <div
                key={date.toString()}
                className="px-2 py-1 text-sm font-medium text-gray-600 text-center border-l first:border-l-0 border-gray-200 flex items-center justify-center"
              >
                {format(date, 'EEE d')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time grid lines */}
      <div className="absolute inset-0 z-0">
        {mode === 'week' ? (
          <div className="grid grid-cols-7 h-full ml-16">
            {dates.map((date) => (
              <div 
                key={date.toString()} 
                className="relative"
              >
                {hours.map((hour) => (
                  <React.Fragment key={`${date}-${hour}`}>
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
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Full hour line with non-business hours styling */}
                <div 
                  className={`absolute w-full border-t border-gray-200 ${
                    !isHourAvailable(hour, dates[0]) ? 
                    'bg-[linear-gradient(135deg,transparent_46%,#e5e7eb_49%,#e5e7eb_51%,transparent_55%)] bg-[length:10px_10px]' : ''
                  }`}
                  style={{ 
                    top: `${(hour - startHour) * hourHeight}px`,
                    height: `${hourHeight}px`
                  }}
                />
                {/* Half hour line */}
                <div 
                  className="absolute w-full border-t border-gray-200 opacity-50"
                  style={{ top: `${(hour - startHour) * hourHeight + hourHeight/2}px` }}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </div>

      {/* Time scale */}
      <div className="absolute top-0 left-0 w-16 h-full bg-white z-20" />
      <div className="absolute top-0 left-0 w-16 z-30">
        {hours.map((hour) => (
          <div
            key={`label-${hour}`}
            className="absolute -top-3 left-2 text-sm text-gray-500 bg-white pr-2"
            style={{ top: `${(hour - startHour) * hourHeight}px` }}
          >
            {format(new Date().setHours(hour, 0, 0, 0), 'HH:00')}
          </div>
        ))}
      </div>
    </div>
  );
};
