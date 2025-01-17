import { useState } from 'react';
import { startOfWeek, addDays } from 'date-fns';

interface TimelineState {
  isModalOpen: boolean;
  selectedTime: string;
  selectedDate: Date;
}

export const useTimelineState = (initialDate: Date) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const getDatesForView = (date: Date, mode: 'day' | 'week') => {
    if (mode === 'week') {
      return Array.from(
        { length: 7 }, 
        (_, i) => addDays(startOfWeek(date, { weekStartsOn: 1 }), i)
      );
    }
    return [date];
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate,
    getDatesForView,
  };
};