import { AppointmentModal } from "@/components/AppointmentModal";
import { ServiceType } from "@/types/service";
import { Appointment } from "@/types/appointment";

interface TimelineModalProps {
  isOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedDate: Date | null;
  selectedTime: string;
  services: ServiceType[];
  onAppointmentCreate?: (appointment: Omit<Appointment, "id">) => void;
}

export const TimelineModal = ({
  isOpen,
  setIsModalOpen,
  selectedDate,
  selectedTime,
  services,
  onAppointmentCreate,
}: TimelineModalProps) => {
  return (
    <AppointmentModal
      onAppointmentCreate={onAppointmentCreate}
      currentDate={selectedDate}
      trigger={<></>}
      isOpen={isOpen}
      onOpenChange={setIsModalOpen}
      defaultTime={selectedTime}
      services={services}
    />
  );
};