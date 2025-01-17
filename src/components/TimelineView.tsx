import { useState } from "react";
import { addDays, startOfWeek } from "date-fns";
import { AppointmentModal } from "./AppointmentModal";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { TimelineContainer } from "./timeline/TimelineContainer";
import { TimelineContent } from "./timeline/TimelineContent";
import { WeekViewHeader } from "./timeline/WeekViewHeader";

interface Appointment {
  id: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
  serviceId?: string;
}

interface TimelineViewProps {
  date: Date;
  appointments: Appointment[];
  mode: 'day' | 'week';
  onAppointmentEdit: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
}

export const TimelineView = ({ 
  date,
  appointments,
  mode,
  onAppointmentEdit,
  onAppointmentDelete,
}: TimelineViewProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9);
  const HOUR_HEIGHT = 100;
  const START_HOUR = 9;
  const PAGE_MARGIN_PERCENT = mode === 'day' ? 2.5 : 0.5;
  const TIME_COLUMN_WIDTH = mode === 'week' ? 48 : 64;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(date);
  const { services = [] } = useBusinessStore();

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const relativeY = e.clientY - rect.top + container.scrollTop;
    const totalMinutes = (relativeY / HOUR_HEIGHT) * 60;
    const hour = Math.floor(totalMinutes / 60) + START_HOUR;
    const minutes = Math.floor((totalMinutes % 60) / 30) * 30;
    const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    if (mode === 'week') {
      const mainContentWidth = container.clientWidth - TIME_COLUMN_WIDTH;
      const columnWidth = mainContentWidth / 7;
      const columnIndex = Math.floor((e.clientX - rect.left - TIME_COLUMN_WIDTH) / columnWidth);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      setSelectedDate(addDays(weekStart, columnIndex));
    } else {
      setSelectedDate(date);
    }
    
    setSelectedTime(timeString);
    setIsModalOpen(true);
  };

  const handleAppointmentCreate = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
    };
    onAppointmentEdit(newAppointment as Appointment);
  };

  const dates = mode === 'week' 
    ? Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date, { weekStartsOn: 1 }), i))
    : [date];

  return (
    <>
      <TimelineContainer hourHeight={HOUR_HEIGHT} onDoubleClick={handleDoubleClick}>
        {mode === 'week' && (
          <WeekViewHeader date={date} timeColumnWidth={TIME_COLUMN_WIDTH} />
        )}
        <TimelineContent
          dates={dates}
          appointments={appointments}
          hours={hours}
          startHour={START_HOUR}
          hourHeight={HOUR_HEIGHT}
          pageMarginPercent={PAGE_MARGIN_PERCENT}
          timeColumnWidth={TIME_COLUMN_WIDTH}
          mode={mode}
          onAppointmentEdit={onAppointmentEdit}
          onAppointmentDelete={onAppointmentDelete}
        />
      </TimelineContainer>

      <AppointmentModal
        onAppointmentCreate={handleAppointmentCreate}
        currentDate={selectedDate}
        trigger={<></>}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultTime={selectedTime}
        services={services}
      />
    </>
  );
};