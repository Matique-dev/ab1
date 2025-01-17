/**
 * TimelineView component displays appointments in a timeline format.
 * Supports day and week views with appointment creation and management.
 * 
 * @component
 * @example
 * ```tsx
 * <TimelineView
 *   date={new Date()}
 *   appointments={appointments}
 *   mode="day"
 *   onAppointmentEdit={(apt) => handleEdit(apt)}
 *   onAppointmentDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
import { useRef } from "react";
import { TimelineContainer } from "./timeline/TimelineContainer";
import { WeekHeader } from "./timeline/WeekHeader";
import { TimelineModal } from "./timeline/TimelineModal";
import { TimelineContent } from "./timeline/TimelineContent";
import { TimelineDoubleClickHandler } from "./timeline/TimelineDoubleClickHandler";
import { useDayViewScroll } from "@/hooks/useDayViewScroll";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useTimelineState } from "@/hooks/useTimelineState";
import { useTimelineConfig } from "@/hooks/useTimelineConfig";
import { Appointment } from "@/types/appointment";

interface TimelineViewProps {
  /** Current date to display */
  date: Date;
  /** List of appointments to display */
  appointments: Appointment[];
  /** View mode - either day or week */
  mode: 'day' | 'week';
  /** Callback when an appointment is edited */
  onAppointmentEdit: (appointment: Appointment) => void;
  /** Callback when an appointment is deleted */
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
      onDoubleClick={() => {}}
      className="scrollbar-hide"
    >
      {mode === 'week' && <WeekHeader dates={dates} timeColumnWidth={TIME_COLUMN_WIDTH} />}

      <TimelineDoubleClickHandler
        scrollContainerRef={scrollContainerRef}
        mode={mode}
        startHour={START_HOUR}
        hourHeight={HOUR_HEIGHT}
        timeColumnWidth={TIME_COLUMN_WIDTH}
        date={date}
        getDatesForView={getDatesForView}
        setSelectedTime={setSelectedTime}
        setSelectedDate={setSelectedDate}
        setIsModalOpen={setIsModalOpen}
      >
        <TimelineContent
          dates={dates}
          appointments={appointments}
          startHour={START_HOUR}
          hourHeight={HOUR_HEIGHT}
          pageMarginPercent={PAGE_MARGIN_PERCENT}
          timeColumnWidth={TIME_COLUMN_WIDTH}
          mode={mode}
          hours={hours}
          onAppointmentEdit={onAppointmentEdit}
          onAppointmentDelete={onAppointmentDelete}
        />
      </TimelineDoubleClickHandler>

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