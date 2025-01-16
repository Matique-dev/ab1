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

export const AppointmentFormFields = ({
  formData,
  setFormData,
  availableEmployees = [],
  services = [],
}: AppointmentFormFieldsProps) => {
  const [selectedService, setSelectedService] = useState<ServiceType | undefined>();
  const [customDuration, setCustomDuration] = useState(false);

  useEffect(() => {
    if (selectedService && !customDuration) {
      setFormData({
        ...formData,
        duration: selectedService.durationMinutes.toString()
      });
    }
  }, [selectedService, customDuration]);

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
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} - €{service.priceEur}
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
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select stylist" />
          </SelectTrigger>
          <SelectContent>
            {availableEmployees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
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