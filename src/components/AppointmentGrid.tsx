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

  const calculateAppointmentColumns = (appointments: Appointment[]) => {
    const sortedAppointments = [...appointments].sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(":").map(Number);
      const [bHours, bMinutes] = b.time.split(":").map(Number);
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
    });

    const columns: { [key: string]: number } = {};
    const maxColumn: { [key: string]: number } = {};

    sortedAppointments.forEach((appointment) => {
      const [hours, minutes] = appointment.time.split(":").map(Number);
      const startTime = hours * 60 + minutes;
      const endTime = startTime + parseInt(appointment.duration);

      let column = 0;
      while (true) {
        let canUseColumn = true;
        
        for (const [id, col] of Object.entries(columns)) {
          if (col === column) {
            const existingApt = sortedAppointments.find(a => a.id === id);
            if (existingApt) {
              const [existingHours, existingMinutes] = existingApt.time.split(":").map(Number);
              const existingStart = existingHours * 60 + existingMinutes;
              const existingEnd = existingStart + parseInt(existingApt.duration);

              if (startTime < existingEnd && endTime > existingStart) {
                canUseColumn = false;
                break;
              }
            }
          }
        }

        if (canUseColumn) break;
        column++;
      }

      columns[appointment.id] = column;
      maxColumn[hours] = Math.max(maxColumn[hours] || 0, column);
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