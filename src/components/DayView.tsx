import { useState } from "react";
import { isSameDay, parse } from "date-fns";
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

  const getStylistColor = (stylist: string) => {
    const colors: { [key: string]: string } = {
      john: "bg-blue-100 border-blue-300",
      josh: "bg-green-100 border-green-300",
      rebecca: "bg-purple-100 border-purple-300",
    };
    return colors[stylist.toLowerCase()] || "bg-gray-100 border-gray-300";
  };

  const calculateAppointmentPosition = (appointment: Appointment, hourAppointments: Appointment[]) => {
    // Parse the time and calculate position
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const duration = parseInt(appointment.duration);
    
    // Calculate top position based on time
    const timeInMinutes = (hours - START_HOUR) * 60 + minutes;
    const topPosition = (timeInMinutes / 60) * HOUR_HEIGHT;
    
    // Calculate height based on duration
    const height = (duration / 60) * HOUR_HEIGHT;

    // Handle overlapping appointments
    const overlappingAppointments = hourAppointments.filter(apt => {
      const [aptHours, aptMinutes] = apt.time.split(":").map(Number);
      const aptTimeInMinutes = (aptHours - START_HOUR) * 60 + aptMinutes;
      const aptDuration = parseInt(apt.duration);
      
      // Check if appointments overlap
      return (
        timeInMinutes < aptTimeInMinutes + aptDuration &&
        timeInMinutes + duration > aptTimeInMinutes &&
        apt.stylist !== appointment.stylist
      );
    });

    const totalOverlapping = overlappingAppointments.length + 1;
    const stylistIndex = hourAppointments
      .filter(apt => apt.time === appointment.time)
      .findIndex(apt => apt.stylist === appointment.stylist);
    
    // Calculate width and left position for overlapping appointments
    const width = `${100 / Math.max(totalOverlapping, 1)}%`;
    const left = `${(stylistIndex * 100) / Math.max(totalOverlapping, 1)}%`;
    
    return { top: topPosition, height, width, left };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative">
      {hours.map((hour) => (
        <div key={hour} className="relative" style={{ height: `${HOUR_HEIGHT}px` }}>
          <div className="absolute -top-3 left-2 text-sm text-gray-500">
            {hour % 12 || 12}:00 {hour >= 12 ? "PM" : "AM"}
          </div>
          <div className="absolute inset-0 border-t border-gray-200" />
          <div className="relative ml-16 mr-4 h-full">
            {appointments
              .filter((apt) => {
                if (!isSameDay(apt.date, date)) return false;
                const [aptHour] = apt.time.split(":").map(Number);
                return aptHour === hour;
              })
              .map((apt) => {
                const hourAppointments = appointments.filter((a) => {
                  if (!isSameDay(a.date, date)) return false;
                  const [aptHour] = a.time.split(":").map(Number);
                  return aptHour === hour;
                });

                const { top, height, width, left } = calculateAppointmentPosition(
                  apt,
                  hourAppointments
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
                        className={`absolute p-2 rounded border cursor-pointer hover:opacity-80 ${getStylistColor(
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
              })}
          </div>
        </div>
      ))}
    </div>
  );
};