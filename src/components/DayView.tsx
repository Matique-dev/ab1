import { useState } from "react";
import { isSameDay } from "date-fns";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date?: Date; // Will be computed from time
}

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
}

export const DayView = ({ date, appointments }: DayViewProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM

  const getStylistColor = (stylist: string) => {
    const colors: { [key: string]: string } = {
      john: "bg-blue-100 border-blue-300",
      josh: "bg-green-100 border-green-300",
      rebecca: "bg-purple-100 border-purple-300",
    };
    return colors[stylist.toLowerCase()] || "bg-gray-100 border-gray-300";
  };

  // Process appointments once, creating Date objects for each
  const processedAppointments = appointments.map(apt => {
    try {
      // Create a new date object for the appointment's day
      const [hours, minutes] = apt.time.split(":").map(Number);
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hours, minutes, 0, 0);
      return { ...apt, date: appointmentDate };
    } catch (e) {
      console.error("Error processing appointment:", e);
      return apt;
    }
  });

  // Function to calculate horizontal position based on overlapping appointments
  const calculateAppointmentPosition = (appointment: Appointment, hourAppointments: Appointment[]) => {
    const overlappingAppointments = hourAppointments.filter(apt => apt.stylist !== appointment.stylist);
    const stylistIndex = hourAppointments.findIndex(apt => apt.stylist === appointment.stylist);
    const totalOverlapping = overlappingAppointments.length + 1;
    
    // Calculate width and left position
    const width = `${100 / Math.max(totalOverlapping, 1)}%`;
    const left = `${(stylistIndex * 100) / Math.max(totalOverlapping, 1)}%`;
    
    return { width, left };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto">
      {hours.map((hour) => {
        // Filter appointments for this hour and this specific day
        const hourAppointments = processedAppointments.filter((apt) => {
          if (!apt.date || !isSameDay(apt.date, date)) return false;
          const [aptHour] = apt.time.split(":");
          return parseInt(aptHour) === hour;
        });

        return (
          <div key={hour} className="relative min-h-[100px] border-b">
            <div className="absolute -top-3 left-2 text-sm text-gray-500">
              {hour % 12 || 12}:00 {hour >= 12 ? "PM" : "AM"}
            </div>
            <div className="relative ml-16 mr-4 h-full">
              {hourAppointments.map((apt) => {
                const { width, left } = calculateAppointmentPosition(apt, hourAppointments);
                
                return (
                  <div
                    key={apt.id}
                    className={`absolute p-2 m-1 rounded border ${getStylistColor(
                      apt.stylist
                    )} ${apt.isWalkIn ? "border-dashed" : ""}`}
                    style={{
                      top: "0.5rem",
                      left,
                      width,
                      minHeight: "3rem",
                    }}
                  >
                    <div className="font-medium truncate">{apt.title}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {apt.stylist.charAt(0).toUpperCase() + apt.stylist.slice(1)} •{" "}
                      {apt.duration} min
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};