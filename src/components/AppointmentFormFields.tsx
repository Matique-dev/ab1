import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/types/schedule";
import { ServiceType } from "@/types/service";
import { useState, useEffect } from "react";
import { Scissors, Brush, Droplet } from "lucide-react";

interface FormData {
  title: string;
  stylist: string;
  time: string;
  duration: string;
  isWalkIn: boolean;
  selectedDate: string;
}

interface AppointmentFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  availableEmployees: Employee[];
  services: ServiceType[];
}

// Map of icon names to components
const iconMap = {
  scissors: Scissors,
  brush: Brush,
  droplet: Droplet
};

const UNASSIGNED_COLOR = "#6557FF";

export const AppointmentFormFields = ({
  formData,
  setFormData,
  availableEmployees = [],
  services = [],
}: AppointmentFormFieldsProps) => {
  const [selectedService, setSelectedService] = useState<ServiceType | undefined>(services[0]);
  const [customDuration, setCustomDuration] = useState(false);

  useEffect(() => {
    if (selectedService && !customDuration) {
      setFormData({
        ...formData,
        duration: selectedService.durationMinutes.toString()
      });
    }
  }, [selectedService, customDuration]);

  useEffect(() => {
    // Set default values when component mounts
    if (!formData.stylist) {
      setFormData({
        ...formData,
        stylist: "anyone"
      });
    }
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, []);

  // Add "Anyone" option to employees list
  const employeeOptions = [
    {
      id: "anyone",
      name: "Anyone",
      color: UNASSIGNED_COLOR,
    },
    ...availableEmployees
  ];

  const renderServiceIcon = (service: ServiceType) => {
    const IconComponent = service.icon ? iconMap[service.icon as keyof typeof iconMap] : Scissors;
    return IconComponent ? <IconComponent className="h-4 w-4 mr-2" /> : null;
  };

  const renderEmployeeIcon = (employee: { color: string }) => {
    return (
      <div 
        className="h-4 w-4 rounded-full mr-2 flex-shrink-0"
        style={{ backgroundColor: employee.color }}
      />
    );
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
        <Select
          value={selectedService?.id}
          onValueChange={(value) => {
            const service = services.find(s => s.id === value);
            setSelectedService(service);
          }}
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="stylist">Stylist</Label>
        <Select
          value={formData.stylist}
          onValueChange={(value) =>
            setFormData({ ...formData, stylist: value })
          }
          defaultValue="anyone"
          required
        >
          <SelectTrigger>
            <SelectValue>
              {formData.stylist && (
                <div className="flex items-center">
                  {renderEmployeeIcon(
                    employeeOptions.find(e => e.id === formData.stylist) || employeeOptions[0]
                  )}
                  <span>
                    {employeeOptions.find(e => e.id === formData.stylist)?.name || "Anyone"}
                  </span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {employeeOptions.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                <div className="flex items-center">
                  {renderEmployeeIcon(employee)}
                  <span>{employee.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="customDuration"
              checked={customDuration}
              onChange={(e) => setCustomDuration(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="customDuration" className="text-sm">Custom duration</Label>
          </div>
        </div>
        
        {customDuration ? (
          <Select
            value={formData.duration}
            onValueChange={(value) =>
              setFormData({ ...formData, duration: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
              <SelectItem value="120">120 minutes</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            value={formData.duration}
            disabled
            className="bg-gray-50"
          />
        )}
      </div>

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