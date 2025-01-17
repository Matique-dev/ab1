import { format } from "date-fns";

interface TimeColumnProps {
  hours: number[];
  timeColumnWidth: number;
}

export const TimeColumn = ({ hours, timeColumnWidth }: TimeColumnProps) => {
  return (
    <div 
      className="sticky left-0 z-20 bg-white"
      style={{ width: `${timeColumnWidth}px` }}
    >
      {hours.map((hour) => (
        <div
          key={`label-${hour}`}
          className="relative"
          style={{ height: `${100}px` }}
        >
          <span className="absolute -top-3 left-2 text-sm text-gray-500">
            {format(new Date().setHours(hour, 0, 0, 0), 'HH:00')}
          </span>
        </div>
      ))}
    </div>
  );
};