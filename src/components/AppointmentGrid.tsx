import { isSameDay } from "date-fns";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentModal } from "./AppointmentModal";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface AppointmentGridProps {
  date: Date;
  appointments: Appointment[];
  hours: number[];
  startHour: number;
  hourHeight: number;
  pageMarginPercent: number;
  onAppointmentEdit: (appointment: Appointment) => void;
}

export const AppointmentGrid = ({
  date,
  appointments,
  hours,
  startHour,
  hourHeight,
  pageMarginPercent,
  onAppointmentEdit,
}: AppointmentGridProps) => {
  const getStylistColor = (stylist: string) => {
    const colors: { [key: string]: string } = {
      john: "bg-blue-100 border-blue-300",
      josh: "bg-green-100 border-green-300",
      rebecca: "bg-purple-100 border-purple-300",
    };
    return colors[stylist.toLowerCase()] || "bg-gray-100 border-gray-300";
  };

  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateAppointmentColumns = (appointments: Appointment[]) => {
    // Sort appointments by start time
    const sortedAppointments = [...appointments].sort((a, b) => {
      return getTimeInMinutes(a.time) - getTimeInMinutes(b.time);
    });

    const columns: { [key: string]: number } = {};
    const maxColumn: { [key: string]: number } = {};

    // For each appointment, find all other appointments that overlap with it
    sortedAppointments.forEach((appointment) => {
      const startTime = getTimeInMinutes(appointment.time);
      const endTime = startTime + parseInt(appointment.duration);

      // Find all appointments that overlap with the current one
      const overlappingAppointments = sortedAppointments.filter(other => {
        if (other.id === appointment.id) return false;
        const otherStart = getTimeInMinutes(other.time);
        const otherEnd = otherStart + parseInt(other.duration);
        return (startTime < otherEnd && endTime > otherStart);
      });

      // Find the first available column that doesn't conflict with overlapping appointments
      let column = 0;
      let foundColumn = false;
      while (!foundColumn) {
        foundColumn = true;
        for (const other of overlappingAppointments) {
          if (columns[other.id] === column) {
            foundColumn = false;
            column++;
            break;
          }
        }
      }

      columns[appointment.id] = column;

      // Update max column for each hour this appointment spans
      const startHour = Math.floor(startTime / 60);
      const endHour = Math.ceil(endTime / 60);
      for (let hour = startHour; hour < endHour; hour++) {
        maxColumn[hour] = Math.max(maxColumn[hour] || 0, column);
      }
    });

    return { columns, maxColumns: maxColumn };
  };

  const calculateAppointmentPosition = (appointment: Appointment, columnInfo: ReturnType<typeof calculateAppointmentColumns>) => {
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const duration = parseInt(appointment.duration);
    
    const timeInMinutes = (hours - startHour) * 60 + minutes;
    const topPosition = (timeInMinutes / 60) * hourHeight;
    
    const heightInHours = duration / 60;
    const height = heightInHours * hourHeight;

    const column = columnInfo.columns[appointment.id];
    const totalColumns = columnInfo.maxColumns[hours] + 1;
    const columnWidth = (100 - (pageMarginPercent * 2)) / Math.max(totalColumns, 1);
    const width = `${columnWidth}%`;
    const left = `${(column * columnWidth) + pageMarginPercent}%`;
    
    return { top: topPosition, height, width, left };
  };

  return (
    <div className="relative ml-16 mr-4 h-full z-10">
      {hours.map((hour) => {
        const hourAppointments = appointments.filter((apt) => {
          if (!isSameDay(apt.date, date)) return false;
          const [aptHour] = apt.time.split(":").map(Number);
          return aptHour === hour;
        });

        const columnInfo = calculateAppointmentColumns(hourAppointments);

        return hourAppointments.map((apt) => {
          const position = calculateAppointmentPosition(apt, columnInfo);

          return (
            <AppointmentModal
              key={apt.id}
              currentDate={date}
              appointment={apt}
              onAppointmentEdit={onAppointmentEdit}
              onAppointmentCreate={() => {}}
              trigger={
                <AppointmentCard
                  appointment={apt}
                  position={position}
                  colorClass={getStylistColor(apt.stylist)}
                  onClick={() => {}}
                />
              }
            />
          );
        });
      })}
    </div>
  );
};