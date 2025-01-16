import React from "react";
import { ServiceType } from "@/types/service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scissors, Brush, Droplet } from "lucide-react";

const iconMap = {
  scissors: Scissors,
  brush: Brush,
  droplet: Droplet
};

interface ServiceSelectProps {
  selectedService?: ServiceType;
  services: ServiceType[];
  onServiceChange: (serviceId: string) => void;
}

export const ServiceSelect = ({
  selectedService,
  services,
  onServiceChange,
}: ServiceSelectProps) => {
  const renderServiceIcon = (service: ServiceType) => {
    const IconComponent = service.icon ? iconMap[service.icon as keyof typeof iconMap] : Scissors;
    return IconComponent ? <IconComponent className="h-4 w-4 mr-2" /> : null;
  };

  return (
    <Select
      value={selectedService?.id}
      onValueChange={onServiceChange}
      required
    >
      <SelectTrigger>
        <SelectValue>
          {selectedService && (
            <div className="flex items-center">
              {renderServiceIcon(selectedService)}
              <span>{selectedService.name} - €{selectedService.priceEur}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {services.map((service) => (
          <SelectItem key={service.id} value={service.id}>
            <div className="flex items-center">
              {renderServiceIcon(service)}
              <span>{service.name} - €{service.priceEur}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};