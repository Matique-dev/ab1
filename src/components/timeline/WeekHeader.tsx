import { format } from "date-fns";

interface WeekHeaderProps {
  dates: Date[];
  timeColumnWidth: number;
}

export const WeekHeader = ({ dates, timeColumnWidth }: WeekHeaderProps) => {
  const columnWidth = `${100 / dates.length}%`;
  
  return (
    <div 
      className="sticky top-0 z-20 flex bg-white border-b border-gray-200"
      style={{ marginLeft: `${timeColumnWidth}px` }}
    >
      {dates.map((date) => (
        <div
          key={date.toString()}
          className="flex-none px-2 py-3 text-sm font-medium text-gray-600 text-center border-l first:border-l-0 border-gray-200"
          style={{ width: columnWidth }}
        >
          {format(date, 'EEE d')}
        </div>
      ))}
    </div>
  );
};