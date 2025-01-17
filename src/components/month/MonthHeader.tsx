interface MonthHeaderProps {
  weekDays: string[];
}

export const MonthHeader = ({ weekDays }: MonthHeaderProps) => {
  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {weekDays.map((day) => (
        <div key={day} className="text-center font-medium py-2 dark:text-gray-300">
          {day}
        </div>
      ))}
    </div>
  );
};