import { useState } from "react";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
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
    return colors[stylist] || "bg-gray-100 border-gray-300";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto">
      {hours.map((hour) => (
        <div key={hour} className="relative min-h-[100px] border-b">
          <div className="absolute -top-3 left-2 text-sm text-gray-500">
            {hour % 12 || 12}:00 {hour >= 12 ? "PM" : "AM"}
          </div>
          {appointments
            .filter((apt) => {
              const [aptHour] = apt.time.split(":");
              return parseInt(aptHour) === hour;
            })
            .map((apt) => (
              <div
                key={apt.id}
                className={`absolute left-16 right-4 p-2 m-1 rounded border ${getStylistColor(
                  apt.stylist
                )} ${apt.isWalkIn ? "border-dashed" : ""}`}
                style={{
                  top: "0.5rem",
                  minHeight: "3rem",
                }}
              >
                <div className="font-medium">{apt.title}</div>
                <div className="text-sm text-gray-600">
                  {apt.stylist.charAt(0).toUpperCase() + apt.stylist.slice(1)} •{" "}
                  {apt.duration} min
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};