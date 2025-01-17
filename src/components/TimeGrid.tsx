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
  timeColumnWidth: number;
}

export const TimeGrid = ({ 
  hours, 
  startHour, 
  hourHeight, 
  mode = 'day', 
  dates = [],
  timeColumnWidth,
}: TimeGridProps) => {
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
    <>
      {/* Time scale background and labels */}
      <div 
        className="sticky left-0 z-20 bg-white"
        style={{ width: `${timeColumnWidth}px` }}
      >
        {hours.map((hour) => (
          <div
            key={`label-${hour}`}
            className="relative"
            style={{ height: `${hourHeight}px` }}
          >
            <span className="absolute -top-3 left-2 text-sm text-gray-500">
              {format(new Date().setHours(hour, 0, 0, 0), 'HH:00')}
            </span>
          </div>
        ))}
      </div>

      {/* Grid lines */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          {mode === 'week' ? (
            <div className="flex h-full">
              {dates.map((date) => (
                <div 
                  key={date.toString()} 
                  className="flex-1 relative border-l first:border-l-0 border-gray-200"
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
                  <div 
                    className="absolute w-full border-t border-gray-200 opacity-50"
                    style={{ top: `${(hour - startHour) * hourHeight + hourHeight/2}px` }}
                  />
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};