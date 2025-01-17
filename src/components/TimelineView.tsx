import { useRef } from "react";
import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";
import { AppointmentModal } from "./AppointmentModal";
import { useDayViewScroll } from "@/hooks/useDayViewScroll";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { WeekHeader } from "./timeline/WeekHeader";
import { TimelineContainer } from "./timeline/TimelineContainer";
import { useTimelineState } from "@/hooks/useTimelineState";

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
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { services = [] } = useBusinessStore();
  const {
    isModalOpen,
    setIsModalOpen,
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate,
    getDatesForView
  } = useTimelineState(date);

  useDayViewScroll(scrollContainerRef, HOUR_HEIGHT);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

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
      const weekStart = getDatesForView(date, 'week')[0];
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

  const dates = getDatesForView(date, mode);

  return (
    <TimelineContainer
      scrollRef={scrollContainerRef}
      onDoubleClick={handleDoubleClick}
    >
      {mode === 'week' && <WeekHeader dates={dates} timeColumnWidth={TIME_COLUMN_WIDTH} />}

      <div className="relative flex flex-1">
        <TimeGrid 
          hours={hours}
          startHour={START_HOUR}
          hourHeight={HOUR_HEIGHT}
          mode={mode}
          dates={dates}
          timeColumnWidth={TIME_COLUMN_WIDTH}
        />
        <AppointmentGrid
          dates={dates}
          appointments={appointments}
          hours={hours}
          startHour={START_HOUR}
          hourHeight={HOUR_HEIGHT}
          pageMarginPercent={PAGE_MARGIN_PERCENT}
          timeColumnWidth={TIME_COLUMN_WIDTH}
          onAppointmentEdit={onAppointmentEdit}
          onAppointmentDelete={onAppointmentDelete}
        />
      </div>

      <AppointmentModal
        onAppointmentCreate={handleAppointmentCreate}
        currentDate={selectedDate}
        trigger={<></>}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultTime={selectedTime}
        services={services}
      />
    </TimelineContainer>
  );
};