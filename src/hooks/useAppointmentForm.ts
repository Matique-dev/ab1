import { useState, useEffect } from "react";
import { format, addHours, startOfHour } from "date-fns";
import { useBusinessStore } from "./useBusinessStore";

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
  const { services } = useBusinessStore();
  
  // Get next hour for default time
  const getDefaultTime = () => {
    const nextHour = addHours(startOfHour(new Date()), 1);
    return format(nextHour, 'HH:mm');
  };

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
    
    // Default initial state for new appointment
    const defaultService = services[0];
    return {
      title: "Client name",
      stylist: "anyone",
      time: getDefaultTime(),
      duration: defaultService?.durationMinutes.toString() || "60",
      isWalkIn: false,
      selectedDate: format(currentDate, 'yyyy-MM-dd'),
      serviceId: defaultService?.id,
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
        // Reset form for new appointment with default values
        const defaultService = services[0];
        setFormData({
          title: "Client name",
          stylist: "anyone",
          time: getDefaultTime(),
          duration: defaultService?.durationMinutes.toString() || "60",
          isWalkIn: false,
          selectedDate: format(currentDate, 'yyyy-MM-dd'),
          serviceId: defaultService?.id,
        });
      }
    }
  }, [isOpen, appointment, currentDate, services]);

  return {
    formData,
    setFormData
  };
};