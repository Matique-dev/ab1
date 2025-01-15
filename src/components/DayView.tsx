import { useState } from "react";
import { isSameDay, format } from "date-fns";
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

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentEdit: (appointment: Appointment) => void;
}

export const DayView = ({ date, appointments, onAppointmentEdit }: DayViewProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM
  const HOUR_HEIGHT = 100; // Height in pixels for one hour
  const START_HOUR = 9; // 9 AM
  const PAGE_MARGIN_PERCENT = 2.5; // 2.5% margin from page edges

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
    
    const timeInMinutes = (hours - START_HOUR) * 60 + minutes;
    const topPosition = (timeInMinutes / 60) * HOUR_HEIGHT;
    
    const heightInHours = duration / 60;
    const height = heightInHours * HOUR_HEIGHT;

    // Calculate width and left position based on column assignment
    const column = columnInfo.columns[appointment.id];
    const totalColumns = columnInfo.maxColumns[hours] + 1;
    const columnWidth = (100 - (PAGE_MARGIN_PERCENT * 2)) / Math.max(totalColumns, 1);
    const width = `${columnWidth}%`;
    const left = `${(column * columnWidth) + PAGE_MARGIN_PERCENT}%`;
    
    return { top: topPosition, height, width, left };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative">
      {/* Time grid lines - placed behind appointments */}
      <div className="absolute inset-0 z-0">
        {hours.map((hour) => (
          <div 
            key={`grid-${hour}`}
            className="absolute w-full border-t border-gray-200"
            style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
          />
        ))}
      </div>

      {/* Time scale background */}
      <div className="absolute top-0 left-0 w-16 h-full bg-white z-20" />
      
      {/* Time labels */}
      <div className="absolute top-0 left-0 w-16 z-30">
        {hours.map((hour) => (
          <div
            key={`label-${hour}`}
            className="absolute -top-3 left-2 text-sm text-gray-500 bg-white pr-2"
            style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
          >
            {format(new Date().setHours(hour, 0, 0, 0), 'HH:00')}
          </div>
        ))}
      </div>

      {/* Appointments container */}
      <div className="relative ml-16 mr-4 h-full z-10">
        {hours.map((hour) => {
          const hourAppointments = appointments.filter((apt) => {
            if (!isSameDay(apt.date, date)) return false;
            const [aptHour] = apt.time.split(":").map(Number);
            return aptHour === hour;
          });

          const columnInfo = calculateAppointmentColumns(hourAppointments);

          return hourAppointments.map((apt) => {
            const { top, height, width, left } = calculateAppointmentPosition(
              apt,
              columnInfo
            );

            return (
              <AppointmentModal
                key={apt.id}
                currentDate={date}
                appointment={apt}
                onAppointmentEdit={onAppointmentEdit}
                onAppointmentCreate={() => {}}
                trigger={
                  <div
                    className={`absolute p-2 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getStylistColor(
                      apt.stylist
                    )} ${apt.isWalkIn ? "border-dashed" : ""}`}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      width,
                      left,
                    }}
                  >
                    <div className="font-medium truncate">{apt.title}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {apt.stylist.charAt(0).toUpperCase() + apt.stylist.slice(1)} •{" "}
                      {apt.duration} min
                    </div>
                  </div>
                }
              />
            );
          });
        })}
      </div>
    </div>
  );
};
