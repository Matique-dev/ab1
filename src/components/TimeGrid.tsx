import { format } from "date-fns";
import { useBusinessStore } from "@/hooks/useBusinessStore";

interface TimeGridProps {
  hours: number[];
  startHour: number;
  hourHeight: number;
  mode?: 'day' | 'week';
  dates?: Date[];
}

export const TimeGrid = ({ hours, startHour, hourHeight, mode = 'day', dates = [] }: TimeGridProps) => {
  const { businessHours } = useBusinessStore();
  const dayOfWeek = format(dates[0], 'EEEE').toLowerCase();
  const { openTime, closeTime } = businessHours[dayOfWeek];
  
  const [openHour] = openTime.split(':').map(Number);
  const [closeHour] = closeTime.split(':').map(Number);

  const isBusinessHour = (hour: number) => {
    return hour >= openHour && hour < closeHour;
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
        {hours.map((hour) => (
          <>
            {/* Full hour line with non-business hours styling */}
            <div 
              key={`grid-${hour}`}
              className={`absolute w-full border-t border-gray-200 ${
                !isBusinessHour(hour) ? 'bg-[linear-gradient(45deg,transparent_46%,#aaadb0_49%,#aaadb0_51%,transparent_55%)] bg-[length:10px_10px]' : ''
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