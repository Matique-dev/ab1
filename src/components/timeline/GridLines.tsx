import React from 'react';
import { isHourAvailable } from '@/utils/businessHoursValidation';
import { useBusinessStore } from '@/hooks/useBusinessStore';

interface GridLinesProps {
  hours: number[];
  startHour: number;
  hourHeight: number;
  mode: 'day' | 'week';
  dates: Date[];
}

export const GridLines = ({ hours, startHour, hourHeight, mode, dates }: GridLinesProps) => {
  const { businessHours, exceptionDates } = useBusinessStore();

  return (
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
                        !isHourAvailable(hour, date, businessHours, exceptionDates) ? 
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
                    !isHourAvailable(hour, dates[0], businessHours, exceptionDates) ? 
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
  );
};