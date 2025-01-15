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

  const doesAppointmentsOverlap = (apt1: Appointment, apt2: Appointment) => {
    const start1 = getTimeInMinutes(apt1.time);
    const end1 = start1 + parseInt(apt1.duration);
    const start2 = getTimeInMinutes(apt2.time);
    const end2 = start2 + parseInt(apt2.duration);

    return start1 < end2 && end1 > start2;
  };

  const getOverlappingGroup = (appointment: Appointment, allAppointments: Appointment[]) => {
    const group = new Set<Appointment>([appointment]);
    
    let prevSize = 0;
    while (prevSize !== group.size) {
      prevSize = group.size;
      allAppointments.forEach(apt => {
        if (!group.has(apt)) {
          for (const groupApt of group) {
            if (doesAppointmentsOverlap(apt, groupApt)) {
              group.add(apt);
              break;
            }
          }
        }
      });
    }
    
    return Array.from(group);
  };

  const calculateAppointmentColumns = (appointments: Appointment[]) => {
    if (appointments.length === 0) return { columns: {}, maxColumns: {} };

    // Sort appointments by start time and then by duration
    const sortedAppointments = [...appointments].sort((a, b) => {
      const startDiff = getTimeInMinutes(a.time) - getTimeInMinutes(b.time);
      if (startDiff === 0) {
        return parseInt(b.duration) - parseInt(a.duration);
      }
      return startDiff;
    });

    const columns: { [key: string]: number } = {};
    const maxColumns: { [key: string]: number } = {};

    // Find all overlapping groups
    const processedAppointments = new Set<string>();
    sortedAppointments.forEach(apt => {
      if (!processedAppointments.has(apt.id)) {
        const overlappingGroup = getOverlappingGroup(apt, sortedAppointments);
        const groupColumns: { [key: string]: number } = {};
        let maxColumn = 0;

        overlappingGroup.forEach(groupApt => {
          let column = 0;
          while (true) {
            const isColumnAvailable = !overlappingGroup.some(
              other => 
                groupColumns[other.id] === column && 
                doesAppointmentsOverlap(groupApt, other)
            );
            if (isColumnAvailable) break;
            column++;
          }
          groupColumns[groupApt.id] = column;
          maxColumn = Math.max(maxColumn, column);
          processedAppointments.add(groupApt.id);
        });

        // Update columns and maxColumns
        Object.assign(columns, groupColumns);
        overlappingGroup.forEach(groupApt => {
          const startMinutes = getTimeInMinutes(groupApt.time);
          const endMinutes = startMinutes + parseInt(groupApt.duration);
          const startHourLocal = Math.floor(startMinutes / 60);
          const endHourLocal = Math.ceil(endMinutes / 60);
          
          for (let hour = startHourLocal; hour <= endHourLocal; hour++) {
            maxColumns[hour] = Math.max(maxColumns[hour] || 0, maxColumn);
          }
        });
      }
    });

    return { columns, maxColumns };
  };

  const calculateAppointmentPosition = (
    appointment: Appointment,
    columnInfo: ReturnType<typeof calculateAppointmentColumns>
  ) => {
    const startMinutes = getTimeInMinutes(appointment.time);
    const duration = parseInt(appointment.duration);

    const topPosition = ((startMinutes - startHour * 60) / 60) * hourHeight;
    const height = (duration / 60) * hourHeight;

    const startHourLocal = Math.floor(startMinutes / 60);
    const endHourLocal = Math.ceil((startMinutes + duration) / 60);
    
    let maxColumnCount = 0;
    for (let hour = startHourLocal; hour <= endHourLocal; hour++) {
      maxColumnCount = Math.max(maxColumnCount, (columnInfo.maxColumns[hour] || 0) + 1);
    }

    const columnWidth = (100 - pageMarginPercent * 2) / maxColumnCount;
    const column = columnInfo.columns[appointment.id];

    const width = `${columnWidth}%`;
    const left = `${column * columnWidth + pageMarginPercent}%`;

    return { top: topPosition, height, width, left };
  };

  // Filter appointments for the current day
  const dayAppointments = appointments.filter(apt => isSameDay(apt.date, date));
  
  // Calculate columns for all appointments at once
  const columnInfo = calculateAppointmentColumns(dayAppointments);

  return (
    <div className="relative ml-16 mr-4 h-full z-10">
      {dayAppointments.map((apt) => {
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
      })}
    </div>
  );
};