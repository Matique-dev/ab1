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
  const [formData, setFormData] = useState<FormData>(() => {
    if (appointment) {
      // Initialize with appointment data if it exists
      return {
        title: appointment.title,
        stylist: appointment.stylist,
        time: format(appointment.date, 'HH:mm'),
        duration: appointment.duration,
        isWalkIn: appointment.isWalkIn,
        selectedDate: format(appointment.date, 'yyyy-MM-dd'),
        serviceId: appointment.serviceId,
      };
    }
    // Default initial state
    return {
      title: "",
      stylist: "",
      time: "",
      duration: "60",
      isWalkIn: false,
      selectedDate: format(currentDate, 'yyyy-MM-dd'),
    };
  });

  // Update form data when modal opens/closes or appointment changes
  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        // Update form with appointment data when editing
        setFormData({
          title: appointment.title,
          stylist: appointment.stylist,
          time: format(appointment.date, 'HH:mm'),
          duration: appointment.duration,
          isWalkIn: appointment.isWalkIn,
          selectedDate: format(appointment.date, 'yyyy-MM-dd'),
          serviceId: appointment.serviceId,
        });
      } else {
        // Reset form for new appointment
        setFormData({
          title: "",
          stylist: "",
          time: "",
          duration: "60",
          isWalkIn: false,
          selectedDate: format(currentDate, 'yyyy-MM-dd'),
        });
      }
    }
  }, [isOpen, appointment, currentDate]);

  return {
    formData,
    setFormData
  };
};