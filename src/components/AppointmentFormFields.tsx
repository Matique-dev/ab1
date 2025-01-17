import { Employee } from "@/types/schedule";
import { ServiceType } from "@/types/service";
import { useState, useEffect } from "react";
import { ServiceSelect } from "./appointment/ServiceSelect";
import { StylistSelect } from "./appointment/StylistSelect";
import { DurationSelect } from "./appointment/DurationSelect";
import { ClientNameInput } from "./appointment/ClientNameInput";
import { DateTimeInputs } from "./appointment/DateTimeInputs";
import { WalkInCheckbox } from "./appointment/WalkInCheckbox";

interface FormData {
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  selectedDate: string;
  serviceId?: string;
}

interface AppointmentFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  availableEmployees: Employee[];
  services: ServiceType[];
}

export const AppointmentFormFields = ({
  formData,
  setFormData,
  availableEmployees = [],
  services = [],
}: AppointmentFormFieldsProps) => {
  const [selectedService, setSelectedService] = useState<ServiceType | undefined>();

  useEffect(() => {
    if (formData.serviceId) {
      const service = services.find(s => s.id === formData.serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [formData.serviceId, services]);

  useEffect(() => {
    if (selectedService) {
      setFormData({
        ...formData,
        duration: selectedService.durationMinutes.toString(),
        serviceId: selectedService.id
      });
    }
  }, [selectedService]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service);
  };

  return (
    <>
      <ClientNameInput
        value={formData.title}
        onChange={(value) => setFormData({ ...formData, title: value })}
      />

      <div className="space-y-2">
        <ServiceSelect
          selectedService={selectedService}
          services={services}
          onServiceChange={handleServiceChange}
        />
      </div>

      <div className="space-y-2">
        <StylistSelect
          selectedStylistId={formData.stylist}
          availableEmployees={availableEmployees}
          onStylistChange={(stylistId) => setFormData({ ...formData, stylist: stylistId })}
        />
      </div>

      <DateTimeInputs
        selectedDate={formData.selectedDate}
        time={formData.time}
        onDateChange={(date) => setFormData({ ...formData, selectedDate: date })}
        onTimeChange={(time) => setFormData({ ...formData, time })}
      />

      <DurationSelect
        duration={formData.duration}
        onDurationChange={(duration) => setFormData({ ...formData, duration })}
      />

      <WalkInCheckbox
        checked={formData.isWalkIn}
        onChange={(checked) => setFormData({ ...formData, isWalkIn: checked })}
      />
    </>
  );
};