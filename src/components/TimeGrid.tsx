import { format } from "date-fns";
import { WeekSchedule, ExceptionDate, isWithinBusinessHours } from "@/utils/businessHours";

interface TimeGridProps {
  hours: number[];
  startHour: number;
  hourHeight: number;
  date: Date;
  weekSchedule: WeekSchedule;
  exceptionDates: ExceptionDate[];
}

export const TimeGrid = ({ 
  hours, 
  startHour, 
  hourHeight,
  date,
  weekSchedule,
  exceptionDates
}: TimeGridProps) => {
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = startHour; hour < startHour + hours.length; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBusinessHours = isWithinBusinessHours(date, time, weekSchedule, exceptionDates);
        
        slots.push({
          time,
          top: (hour - startHour) * hourHeight + (minute / 60) * hourHeight,
          isBusinessHours
        });
      }
    }
    return slots;
  };

  return (
    <>
      {/* Non-business hours overlay */}
      <div className="absolute inset-0 z-0">
        {generateTimeSlots().map((slot, index) => (
          !slot.isBusinessHours && (
            <div
              key={`overlay-${slot.time}`}
              className="absolute w-full bg-[repeating-linear-gradient(45deg,#f0f0f0,#f0f0f0_4px,transparent_4px,transparent_8px)]"
              style={{
                top: `${slot.top}px`,
                height: `${hourHeight / 2}px`,
              }}
            />
          )
        ))}
      </div>

      {/* Time grid lines */}
      <div className="absolute inset-0 z-0">
        {hours.map((hour) => (
          <>
            {/* Full hour line */}
            <div 
              key={`grid-${hour}`}
              className="absolute w-full border-t border-gray-200"
              style={{ top: `${(hour - startHour) * hourHeight}px` }}
            />
            {/* Half hour line */}
            <div 
              key={`grid-${hour}-30`}
              className="absolute w-full border-t border-gray-200 opacity-50"
              style={{ top: `${(hour - startHour) * hourHeight + hourHeight/2}px` }}
            />
          </>
        ))}
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