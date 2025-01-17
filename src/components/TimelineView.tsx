import { useRef } from "react";
import { addDays } from "date-fns";
import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";
import { useDayViewScroll } from "@/hooks/useDayViewScroll";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { WeekHeader } from "./timeline/WeekHeader";
import { TimelineContainer } from "./timeline/TimelineContainer";
import { useTimelineState } from "@/hooks/useTimelineState";
import { useTimelineConfig } from "@/hooks/useTimelineConfig";
import { TimelineModal } from "./timeline/TimelineModal";
import { Appointment } from "@/types/appointment";

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
  const {
    hours,
    HOUR_HEIGHT,
    START_HOUR,
    PAGE_MARGIN_PERCENT,
    TIME_COLUMN_WIDTH,
  } = useTimelineConfig(mode);
  
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
      className="scrollbar-hide"
    >
      {mode === 'week' && <WeekHeader dates={dates} timeColumnWidth={TIME_COLUMN_WIDTH} />}

      <div className="relative flex flex-1 scrollbar-hide">
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

      <TimelineModal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        services={services}
        onAppointmentCreate={handleAppointmentCreate}
      />
    </TimelineContainer>
  );
};