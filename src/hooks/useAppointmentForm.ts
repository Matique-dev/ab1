import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Appointment {
  id?: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
  serviceId?: string;
}

interface FormData {
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  selectedDate: string;
  serviceId?: string;
}

export const useAppointmentForm = (
  currentDate: Date,
  appointment?: Appointment,
  isOpen?: boolean
) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    stylist: "",
    time: "",
    duration: "60",
    isWalkIn: false,
    selectedDate: format(currentDate, 'yyyy-MM-dd'),
    serviceId: undefined
  });

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        setFormData({
          title: appointment.title,
          stylist: appointment.stylist,
          time: format(appointment.date, 'HH:mm'),
          duration: appointment.duration,
          isWalkIn: appointment.isWalkIn,
          selectedDate: format(appointment.date, 'yyyy-MM-dd'),
          serviceId: appointment.serviceId
        });
      } else {
        setFormData({
          title: "",
          stylist: "",
          time: "",
          duration: "60",
          isWalkIn: false,
          selectedDate: format(currentDate, 'yyyy-MM-dd'),
          serviceId: undefined
        });
      }
    }
  }, [isOpen, appointment, currentDate]);

  return {
    formData,
    setFormData
  };
};