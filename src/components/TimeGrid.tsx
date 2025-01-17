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
    const duration = "60"; // We check availability for the full hour

    // First check exception dates
    const exceptionCheck = isWithinExceptionHours(
      date,
      time,
      duration,
      exceptionDates
    );

    if (!exceptionCheck.isValid) {
      return false;
    }

    // Then check regular business hours
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
      {/* Column headers for week view */}
      {mode === 'week' && dates.length > 0 && (
        <div className="absolute top-0 left-16 right-0 flex border-b border-gray-200 bg-white z-20">
          {dates.map((date, index) => (
            <div
              key={date.toString()}
              className="flex-1 px-2 py-1 text-sm font-medium text-gray-600 text-center border-l first:border-l-0 border-gray-200"
            >
              {format(date, 'EEE d')}
            </div>
          ))}
        </div>
      )}

      {/* Time grid lines */}
      <div className="absolute inset-0 z-0">
        {mode === 'week' ? (
          // Week view - create grid for each day
          <div className="flex h-full">
            {dates.map((date, dateIndex) => (
              <div key={date.toString()} className="flex-1">
                {hours.map((hour) => (
                  <>
                    {/* Full hour line with non-business hours styling */}
                    <div 
                      key={`grid-${hour}-${dateIndex}`}
                      className={`absolute w-[calc(100%/7)] border-t border-gray-200 ${
                        !isHourAvailable(hour, date) ? 
                        'bg-[linear-gradient(135deg,transparent_46%,#e5e7eb_49%,#e5e7eb_51%,transparent_55%)] bg-[length:10px_10px]' : ''
                      }`}
                      style={{ 
                        top: `${(hour - startHour) * hourHeight}px`,
                        height: `${hourHeight}px`,
                        left: `${(dateIndex * 100) / 7}%`
                      }}
                    />
                    {/* Half hour line */}
                    <div 
                      key={`grid-${hour}-30-${dateIndex}`}
                      className="absolute w-[calc(100%/7)] border-t border-gray-200 opacity-50"
                      style={{ 
                        top: `${(hour - startHour) * hourHeight + hourHeight/2}px`,
                        left: `${(dateIndex * 100) / 7}%`
                      }}
                    />
                  </>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Day view - single column
          <>
            {hours.map((hour) => (
              <>
                {/* Full hour line with non-business hours styling */}
                <div 
                  key={`grid-${hour}`}
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
                  key={`grid-${hour}-30`}
                  className="absolute w-full border-t border-gray-200 opacity-50"
                  style={{ top: `${(hour - startHour) * hourHeight + hourHeight/2}px` }}
                />
              </>
            ))}
          </>
        )}
      </div>

      {/* Time scale background */}
      <div className="absolute top-0 left-0 w-16 h-full bg-white z-20" />
      
      {/* Time labels */}
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
    </>
  );
};