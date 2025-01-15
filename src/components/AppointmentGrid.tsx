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
    // Sort appointments by start time, then by duration (longer appointments first)
    const sortedAppointments = [...appointments].sort((a, b) => {
      const startDiff = getTimeInMinutes(a.time) - getTimeInMinutes(b.time);
      if (startDiff === 0) {
        return parseInt(b.duration) - parseInt(a.duration); // Longer duration first
      }
      return startDiff;
    });

    const columns: { [key: string]: number } = {};
    const maxColumns: { [key: string]: number } = {};

    // Create time slots for collision detection
    const timeSlots: { [key: number]: Set<number> } = {};

    sortedAppointments.forEach((appointment) => {
      const startTime = getTimeInMinutes(appointment.time);
      const endTime = startTime + parseInt(appointment.duration);

      // Find the first available column by checking all time slots
      let column = 0;
      let columnFound = false;

      while (!columnFound) {
        columnFound = true;
        // Check each minute in the appointment duration
        for (let time = startTime; time < endTime; time++) {
          if (!timeSlots[time]) {
            timeSlots[time] = new Set();
          }
          if (timeSlots[time].has(column)) {
            columnFound = false;
            column++;
            break;
          }
        }
      }

      // Reserve all time slots for this appointment
      for (let time = startTime; time < endTime; time++) {
        if (!timeSlots[time]) {
          timeSlots[time] = new Set();
        }
        timeSlots[time].add(column);

        // Update max columns for each minute
        const hour = Math.floor(time / 60);
        maxColumns[hour] = Math.max(maxColumns[hour] || 0, column);
      }

      columns[appointment.id] = column;
    });

    return { columns, maxColumns };
  };

  const calculateAppointmentPosition = (appointment: Appointment, columnInfo: ReturnType<typeof calculateAppointmentColumns>) => {
    const startTime = getTimeInMinutes(appointment.time);
    const duration = parseInt(appointment.duration);
    
    const topPosition = ((startTime - startHour * 60) / 60) * hourHeight;
    const height = (duration / 60) * hourHeight;

    const hour = Math.floor(startTime / 60);
    const totalColumns = columnInfo.maxColumns[hour] + 1;
    const columnWidth = (100 - (pageMarginPercent * 2)) / Math.max(totalColumns, 1);
    const column = columnInfo.columns[appointment.id];
    
    const width = `${columnWidth}%`;
    const left = `${(column * columnWidth) + pageMarginPercent}%`;
    
    return { top: topPosition, height, width, left };
  };

  return (
    <div className="relative ml-16 mr-4 h-full z-10">
      {hours.map((hour) => {
        const hourAppointments = appointments.filter((apt) => {
          if (!isSameDay(apt.date, date)) return false;
          const aptStartHour = Math.floor(getTimeInMinutes(apt.time) / 60);
          const aptEndHour = Math.ceil((getTimeInMinutes(apt.time) + parseInt(apt.duration)) / 60);
          return aptStartHour <= hour && aptEndHour > hour;
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