import { TimeGrid } from "./TimeGrid";
import { AppointmentGrid } from "./AppointmentGrid";
import { useRef, useState } from "react";
import { AppointmentModal } from "./AppointmentModal";
import { useDayViewScroll } from "@/hooks/useDayViewScroll";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { addDays, startOfWeek, format } from "date-fns";

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
  const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM
  const HOUR_HEIGHT = 100;
  const START_HOUR = 9;
  const PAGE_MARGIN_PERCENT = mode === 'day' ? 2.5 : 0.5;
  const TIME_COLUMN_WIDTH = mode === 'week' ? 48 : 64; // px
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(date);
  const { services = [] } = useBusinessStore();

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
      <div 
        ref={scrollContainerRef}
        className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative scroll-smooth"
        onDoubleClick={handleDoubleClick}
      >
        {/* Week view header */}
        {mode === 'week' && (
          <div 
            className="sticky top-0 z-20 flex bg-white border-b border-gray-200"
            style={{ marginLeft: `${TIME_COLUMN_WIDTH}px` }}
          >
            {dates.map((date) => (
              <div
                key={date.toString()}
                className="flex-1 px-2 py-3 text-sm font-medium text-gray-600 text-center border-l first:border-l-0 border-gray-200"
              >
                {format(date, 'EEE d')}
              </div>
            ))}
          </div>
        )}

        {/* Main grid container */}
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
    </>
  );
};