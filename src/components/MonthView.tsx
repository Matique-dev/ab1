import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { AppointmentModal } from "@/components/AppointmentModal";
import { useState } from "react";
import { MonthDayCell } from "./month/MonthDayCell";
import { MonthHeader } from "./month/MonthHeader";
import { CALENDAR_TRANSLATIONS } from "@/constants/translations";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface MonthViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
}

export const MonthView = ({ 
  date, 
  appointments, 
  onAppointmentEdit, 
  onAppointmentDelete 
}: MonthViewProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { locale: fr, weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr, weekStartsOn: 1 });
  const { businessHours, services } = useBusinessStore();

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day: Date) => {
    return appointments
      .filter(apt => apt.date && isSameDay(apt.date, day))
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return a.date.getTime() - b.date.getTime();
      });
  };

  const isBusinessDay = (day: Date) => {
    const dayOfWeek = format(day, 'EEEE').toLowerCase();
    return businessHours[dayOfWeek]?.isOpen;
  };

  const handleDayClick = (day: Date) => {
    setSelectedAppointment(undefined);
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <MonthHeader weekDays={CALENDAR_TRANSLATIONS.WEEKDAYS.SHORT} />
      <div className="grid grid-cols-7 gap-1 p-4">
        {days.map((day) => (
          <MonthDayCell
            key={day.toString()}
            day={day}
            currentMonth={date}
            appointments={getAppointmentsForDay(day)}
            isBusinessDay={isBusinessDay(day)}
            onDayClick={handleDayClick}
            onAppointmentClick={handleAppointmentClick}
          />
        ))}
      </div>
      <AppointmentModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentDate={selectedDate || date}
        appointment={selectedAppointment}
        onAppointmentEdit={onAppointmentEdit}
        onAppointmentDelete={onAppointmentDelete}
        services={services}
      />
    </>
  );
};