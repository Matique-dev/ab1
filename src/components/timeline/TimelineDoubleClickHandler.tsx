import React, { RefObject } from 'react';
import { addDays } from "date-fns";

interface TimelineDoubleClickHandlerProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  mode: 'day' | 'week';
  startHour: number;
  hourHeight: number;
  timeColumnWidth: number;
  date: Date;
  getDatesForView: (date: Date, mode: 'day' | 'week') => Date[];
  setSelectedTime: (time: string) => void;
  setSelectedDate: (date: Date) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export const TimelineDoubleClickHandler = ({
  scrollContainerRef,
  mode,
  startHour,
  hourHeight,
  timeColumnWidth,
  date,
  getDatesForView,
  setSelectedTime,
  setSelectedDate,
  setIsModalOpen,
  children,
}: TimelineDoubleClickHandlerProps) => {
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore if clicking on an appointment card
    if ((e.target as HTMLElement).closest('.appointment-card')) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeY = e.clientY - rect.top + container.scrollTop;
    const totalMinutes = (relativeY / hourHeight) * 60;
    const hour = Math.floor(totalMinutes / 60) + startHour;
    const minutes = Math.floor((totalMinutes % 60) / 30) * 30;
    const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    if (mode === 'week') {
      const mainContentWidth = container.clientWidth - timeColumnWidth;
      const columnWidth = mainContentWidth / 7;
      const columnIndex = Math.floor((e.clientX - rect.left - timeColumnWidth) / columnWidth);
      const weekStart = getDatesForView(date, 'week')[0];
      setSelectedDate(addDays(weekStart, columnIndex));
    } else {
      setSelectedDate(date);
    }
    
    setSelectedTime(timeString);
    setIsModalOpen(true);
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {children}
    </div>
  );
};