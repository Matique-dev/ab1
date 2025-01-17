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
import { useAppointmentValidation } from "@/hooks/useAppointmentValidation";
import { useNotificationStore } from "@/stores/notificationStore";
import { AvailableEmployeesProvider } from "./appointment/AvailableEmployeesProvider";
import { ServiceType } from "@/types/service";

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
  onAppointmentCreate?: (appointment: Omit<Appointment, "id">) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
  currentDate: Date;
  appointment?: Appointment;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTime?: string;
  services: ServiceType[];
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
  services,
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
  const { validateAppointment } = useAppointmentValidation();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (isOpen && defaultTime) {
      setFormData(prev => ({ ...prev, time: defaultTime }));
    }
  }, [isOpen, defaultTime, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAppointment(formData)) {
      return;
    }

    handleSubmit(formData, appointment);
    addNotification({
      type: "business_hours",
      message: `Appointment ${appointment ? 'updated' : 'created'} for ${formData.title}`,
      appointmentId: appointment?.id || "new",
    });
  };

  const onDelete = () => {
    if (appointment?.id) {
      handleDelete(appointment.id);
      addNotification({
        type: "business_hours",
        message: `Appointment deleted for ${appointment.title}`,
        appointmentId: appointment.id,
      });
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
        <AvailableEmployeesProvider
          currentDate={currentDate}
          currentTime={formData.time}
        >
          {(availableEmployees) => (
            <AppointmentModalContent
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              onDelete={appointment ? onDelete : undefined}
              appointment={appointment}
              availableEmployees={availableEmployees}
              services={services}
            />
          )}
        </AvailableEmployeesProvider>
      </DialogContent>
    </Dialog>
  );
};