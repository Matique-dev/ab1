import { format } from "date-fns";

interface TimeGridProps {
  hours: number[];
  startHour: number;
  hourHeight: number;
}

const DEFAULT_HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
const DEFAULT_START_HOUR = 8;
const DEFAULT_HOUR_HEIGHT = 60;

export const TimeGrid = ({ 
  hours = DEFAULT_HOURS,
  startHour = DEFAULT_START_HOUR,
  hourHeight = DEFAULT_HOUR_HEIGHT 
}: TimeGridProps) => {
  return (
    <>
      {/* Time grid lines */}
      <div className="absolute inset-0 z-0">
        {hours.map((hour) => (
          <div key={`grid-${hour}`}>
            {/* Full hour line */}
            <div 
              className="absolute w-full border-t border-gray-200"
              style={{ top: `${(hour - startHour) * hourHeight}px` }}
            />
            {/* Half hour line */}
            <div 
              className="absolute w-full border-t border-gray-200 opacity-50"
              style={{ top: `${(hour - startHour) * hourHeight + hourHeight/2}px` }}
            />
          </div>
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