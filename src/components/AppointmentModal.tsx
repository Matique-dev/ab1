import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { useAppointmentModal } from "@/hooks/useAppointmentModal";
import { AppointmentModalContent } from "./AppointmentModalContent";
import { Employee } from "@/types/schedule";
import { format } from "date-fns";
import { isWithinBusinessHours } from "@/utils/timeUtils";
import { useBusinessStore } from "@/hooks/useBusinessStore";

interface Appointment {
  id?: string;
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  date: Date;
}

interface AppointmentModalProps {
  onAppointmentCreate: (appointment: Omit<Appointment, "id">) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
  currentDate: Date;
  appointment?: Appointment;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTime?: string;
}

export const AppointmentModal = ({ 
  onAppointmentCreate, 
  onAppointmentEdit,
  onAppointmentDelete,
  currentDate, 
  appointment,
  trigger,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  defaultTime,
}: AppointmentModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalIsOpen;
  
  const { formData, setFormData } = useAppointmentForm(currentDate, appointment, isOpen);
  const { handleSubmit, handleDelete } = useAppointmentModal({
    onAppointmentCreate,
    onAppointmentEdit,
    onAppointmentDelete,
    onOpenChange,
  });

  // Get all business configuration from the store
  const { 
    employees = [], 
    services = [], 
    businessHours,
    exceptionDates = [] 
  } = useBusinessStore();

  useEffect(() => {
    if (isOpen && defaultTime) {
      setFormData(prev => ({ ...prev, time: defaultTime }));
    }
  }, [isOpen, defaultTime, setFormData]);

  // Get available employees for the selected time slot
  const getAvailableEmployees = () => {
    const dayOfWeek = format(currentDate, 'EEEE').toLowerCase();
    const currentTime = formData.time;

    // Check for exception dates
    const exceptionDate = exceptionDates.find(ex => 
      format(ex.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );

    if (exceptionDate?.isAllDayOff) {
      return [];
    }

    return employees.filter(employee => {
      const schedule = employee.schedule[dayOfWeek];
      if (!schedule.isAvailable) return false;

      // Check if within business hours
      if (businessHours && !isWithinBusinessHours(
        currentTime,
        exceptionDate?.openTime || businessHours[dayOfWeek].openTime,
        exceptionDate?.closeTime || businessHours[dayOfWeek].closeTime
      )) {
        return false;
      }

      // Check employee availability
      return isWithinBusinessHours(currentTime, schedule.workStart, schedule.workEnd);
    });
  };

  const availableEmployees = getAvailableEmployees();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData, appointment);
  };

  const onDelete = () => {
    if (appointment?.id) {
      handleDelete(appointment.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-salon-pink to-salon-peach hover:opacity-90">
            New Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "Schedule Appointment"}
          </DialogTitle>
        </DialogHeader>
        <AppointmentModalContent
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          onDelete={appointment ? onDelete : undefined}
          appointment={appointment}
          availableEmployees={availableEmployees}
          services={services}
        />
      </DialogContent>
    </Dialog>
  );
};