import { useAppointmentModalState } from "@/hooks/useAppointmentModalState";
import { AppointmentModalContent } from "./AppointmentModalContent";
import { AvailableEmployeesProvider } from "./appointment/AvailableEmployeesProvider";
import { ServiceType } from "@/types/service";
import { AppointmentModalWrapper } from "./appointment/AppointmentModalWrapper";
import { useState } from "react";

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

  const {
    formData,
    setFormData,
    handleSubmit,
    handleDelete,
  } = useAppointmentModalState({
    onAppointmentCreate,
    onAppointmentEdit,
    onAppointmentDelete,
    currentDate,
    appointment,
    isOpen,
    onOpenChange,
    defaultTime,
  });

  return (
    <AppointmentModalWrapper
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={appointment ? "Edit Appointment" : "Schedule Appointment"}
      trigger={trigger}
    >
      <AvailableEmployeesProvider
        currentDate={currentDate}
        currentTime={formData.time}
      >
        {(availableEmployees) => (
          <AppointmentModalContent
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onDelete={appointment ? handleDelete : undefined}
            appointment={appointment}
            availableEmployees={availableEmployees}
            services={services}
          />
        )}
      </AvailableEmployeesProvider>
    </AppointmentModalWrapper>
  );
};