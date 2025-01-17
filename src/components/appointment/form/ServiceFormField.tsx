import { ServiceType } from "@/types/service";
import { ServiceSelect } from "../ServiceSelect";

interface ServiceFormFieldProps {
  selectedService?: ServiceType;
  services: ServiceType[];
  onServiceChange: (serviceId: string) => void;
}

export const ServiceFormField = ({
  selectedService,
  services,
  onServiceChange,
}: ServiceFormFieldProps) => {
  return (
    <div className="space-y-2">
      <ServiceSelect
        selectedService={selectedService}
        services={services}
        onServiceChange={onServiceChange}
      />
    </div>
  );
};