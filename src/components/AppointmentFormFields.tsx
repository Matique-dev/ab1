import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee } from "@/types/schedule";
import { ServiceType } from "@/types/service";
import { useState, useEffect } from "react";
import { ServiceSelect } from "./appointment/ServiceSelect";
import { StylistSelect } from "./appointment/StylistSelect";
import { DurationSelect } from "./appointment/DurationSelect";

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
  const [customDuration, setCustomDuration] = useState(false);

  // Initialize selected service based on serviceId
  useEffect(() => {
    if (services.length > 0 && formData.serviceId) {
      const service = services.find(s => s.id === formData.serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [services, formData.serviceId]);

  // Set custom duration state based on duration value
  useEffect(() => {
    if (formData.duration) {
      const matchingService = services.find(
        service => service.durationMinutes.toString() === formData.duration
      );
      setCustomDuration(!matchingService);
    }
  }, [formData.duration, services]);

  // Update form data when service changes
  useEffect(() => {
    if (selectedService && !customDuration) {
      setFormData({
        ...formData,
        duration: selectedService.durationMinutes.toString(),
        serviceId: selectedService.id
      });
    }
  }, [selectedService, customDuration]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Client Name</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service</Label>
        <ServiceSelect
          selectedService={selectedService}
          services={services}
          onServiceChange={handleServiceChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stylist">Stylist</Label>
        <StylistSelect
          selectedStylistId={formData.stylist}
          availableEmployees={availableEmployees}
          onStylistChange={(stylistId) => setFormData({ ...formData, stylist: stylistId })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.selectedDate}
            onChange={(e) =>
              setFormData({ ...formData, selectedDate: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            required
          />
        </div>
      </div>

      <DurationSelect
        duration={formData.duration}
        customDuration={customDuration}
        onDurationChange={(duration) => setFormData({ ...formData, duration })}
        onCustomDurationChange={setCustomDuration}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="walkIn"
          checked={formData.isWalkIn}
          onChange={(e) =>
            setFormData({ ...formData, isWalkIn: e.target.checked })
          }
          className="rounded border-gray-300"
        />
        <Label htmlFor="walkIn">Walk-in appointment</Label>
      </div>
    </>
  );
};