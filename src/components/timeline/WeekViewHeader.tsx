import { format, startOfWeek, addDays } from "date-fns";

interface WeekViewHeaderProps {
  date: Date;
  timeColumnWidth: number;
}

export const WeekViewHeader = ({ date, timeColumnWidth }: WeekViewHeaderProps) => {
  const dates = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(date, { weekStartsOn: 1 }), i)
  );

  return (
    <div 
      className="sticky top-0 z-20 flex bg-white border-b border-gray-200"
      style={{ marginLeft: `${timeColumnWidth}px` }}
    >
      {dates.map((date) => (
        <div
          key={date.toString()}
          className="flex-1 px-2 py-3 text-sm font-medium text-gray-600 text-center border-l first:border-l-0 border-gray-200"
        >
          {format(date, 'EEE d')}
        </div>
      ))}
    </div>
  );
};