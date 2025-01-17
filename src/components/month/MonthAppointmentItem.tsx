import { Appointment } from "@/types/appointment";

interface MonthAppointmentItemProps {
  appointment: Appointment;
  onClick: (e: React.MouseEvent) => void;
}

export const MonthAppointmentItem = ({
  appointment,
  onClick,
}: MonthAppointmentItemProps) => {
  const getEmployeeColor = (stylist: string) => {
    const colors: { [key: string]: string } = {
      default: '#6557FF',
    };
    const baseColor = colors[stylist] || colors.default;
    return {
      backgroundColor: `${baseColor}66`,
      borderLeft: `2px solid ${baseColor}`,
    };
  };

  return (
    <div
      className="p-1 rounded text-xs truncate hover:opacity-80 transition-opacity dark:text-gray-100"
      style={getEmployeeColor(appointment.stylist)}
      onClick={onClick}
    >
      {appointment.time} - {appointment.title}
    </div>
  );
};