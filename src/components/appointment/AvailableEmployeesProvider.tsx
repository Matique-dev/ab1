import { format } from "date-fns";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { isWithinBusinessHours } from "@/utils/timeUtils";
import { Employee } from "@/types/schedule";

interface AvailableEmployeesProviderProps {
  currentDate: Date;
  currentTime: string;
  children: (employees: Employee[]) => React.ReactNode;
}

export const AvailableEmployeesProvider = ({
  currentDate,
  currentTime,
  children,
}: AvailableEmployeesProviderProps) => {
  const { employees = [], businessHours, exceptionDates = [] } = useBusinessStore();

  const getAvailableEmployees = () => {
    // If no time is selected yet, return all employees
    if (!currentTime) {
      return employees;
    }

    const dayOfWeek = format(currentDate, 'EEEE').toLowerCase();

    // Check for exception dates
    const exceptionDate = exceptionDates.find(ex => 
      format(ex.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );

    if (exceptionDate?.isAllDayOff) {
      return [];
    }

    return employees.filter(employee => {
      const schedule = employee.schedule[dayOfWeek];
      if (!schedule.isAvailable) return false;

      // Check if within business hours
      if (businessHours && !isWithinBusinessHours(
        currentTime,
        exceptionDate?.openTime || businessHours[dayOfWeek].openTime,
        exceptionDate?.closeTime || businessHours[dayOfWeek].closeTime
      )) {
        return false;
      }

      // Check employee availability
      return isWithinBusinessHours(currentTime, schedule.workStart, schedule.workEnd);
    });
  };

  return <>{children(getAvailableEmployees())}</>;
};