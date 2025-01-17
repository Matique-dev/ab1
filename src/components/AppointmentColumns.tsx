import { getTimeInMinutes, doesAppointmentsOverlap, getOverlappingGroup } from "@/utils/appointmentCalculations";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface ColumnInfo {
  columns: { [key: string]: number };
  maxColumns: { [key: string]: number };
}

export const calculateAppointmentColumns = (appointments: Appointment[]): ColumnInfo => {
  if (appointments.length === 0) return { columns: {}, maxColumns: {} };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const startDiff = getTimeInMinutes(a.time) - getTimeInMinutes(b.time);
    if (startDiff === 0) {
      return parseInt(b.duration) - parseInt(a.duration);
    }
    return startDiff;
  });

  const columns: { [key: string]: number } = {};
  const maxColumns: { [key: string]: number } = {};

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

export const calculateAppointmentPosition = (
  appointment: Appointment,
  columnInfo: ColumnInfo,
  startHour: number,
  hourHeight: number,
  pageMarginPercent: number,
  mode: 'day' | 'week' = 'day'
) => {
  const startMinutes = getTimeInMinutes(appointment.time);
  const duration = parseInt(appointment.duration);

  // Calculate vertical position relative to the start hour
  const topPosition = ((startMinutes - startHour * 60) / 60) * hourHeight;
  const height = (duration / 60) * hourHeight;

  const startHourLocal = Math.floor(startMinutes / 60);
  const endHourLocal = Math.ceil((startMinutes + duration) / 60);
  
  let maxColumnCount = 0;
  for (let hour = startHourLocal; hour <= endHourLocal; hour++) {
    maxColumnCount = Math.max(maxColumnCount, (columnInfo.maxColumns[hour] || 0) + 1);
  }

  console.log(`Mode: ${mode}, MaxColumnCount: ${maxColumnCount}`);

  // Calculate width and left position based on view mode
  let width: string;
  let left: string;

  if (mode === 'day') {
    // Day view: use full width unless there are concurrent appointments
    const columnWidth = maxColumnCount > 1 
      ? (100 - pageMarginPercent * 2) / maxColumnCount
      : 100 - pageMarginPercent * 2;
    
    const leftPosition = maxColumnCount > 1
      ? columnInfo.columns[appointment.id] * columnWidth + pageMarginPercent
      : pageMarginPercent;

    width = `${columnWidth}%`;
    left = `${leftPosition}%`;

    console.log(`Day View - Width: ${width}, Left: ${left}, Top: ${topPosition}`);
  } else {
    // Week view: fixed width per day column
    const dayWidth = (100 - pageMarginPercent * 2) / 7;
    const columnWidth = maxColumnCount > 1 ? dayWidth / maxColumnCount : dayWidth;
    const leftPosition = (columnInfo.columns[appointment.id] % 7) * dayWidth + pageMarginPercent;
    
    width = `${columnWidth}%`;
    left = `${leftPosition}%`;

    console.log(`Week View - Width: ${width}, Left: ${left}, Top: ${topPosition}`);
  }

  return { 
    top: topPosition, 
    height, 
    width, 
    left 
  };
};