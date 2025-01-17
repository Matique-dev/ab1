import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { useAppointmentValidation } from "@/hooks/useAppointmentValidation";

interface Appointment {
  id?: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface UseAppointmentModalStateProps {
  onAppointmentCreate?: (appointment: Omit<Appointment, "id">) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
  currentDate: Date;
  appointment?: Appointment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTime?: string;
}

export const useAppointmentModalState = ({
  onAppointmentCreate,
  onAppointmentEdit,
  onAppointmentDelete,
  currentDate,
  appointment,
  isOpen,
  onOpenChange,
  defaultTime,
}: UseAppointmentModalStateProps) => {
  const { toast } = useToast();
  const { formData, setFormData } = useAppointmentForm(currentDate, appointment, isOpen);
  const { validateAppointment } = useAppointmentValidation();

  useEffect(() => {
    if (isOpen && defaultTime) {
      setFormData(prev => ({ ...prev, time: defaultTime }));
    }
  }, [isOpen, defaultTime, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAppointment(formData)) {
      return;
    }

    if (appointment?.id && onAppointmentEdit) {
      onAppointmentEdit({ ...formData, id: appointment.id, date: new Date(formData.selectedDate) });
    } else if (onAppointmentCreate) {
      onAppointmentCreate({ ...formData, date: new Date(formData.selectedDate) });
    }

    toast({
      title: appointment ? "Appointment Updated" : "Appointment Created",
      description: `Appointment ${appointment ? 'updated' : 'created'} for ${formData.title}`,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (appointment?.id && onAppointmentDelete) {
      onAppointmentDelete(appointment.id);
      toast({
        title: "Appointment Deleted",
        description: `Appointment deleted for ${appointment.title}`,
      });
      onOpenChange(false);
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleDelete,
  };
};