import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Icons from 'lucide-react';
import { ServiceType } from '@/types/service';

interface ServiceCardProps {
  service: ServiceType;
  onUpdate: (updatedService: ServiceType) => void;
  onDelete: (id: string) => void;
}

const durations = [15, 30, 45, 60, 90, 120];

export const ServiceCard = ({ service, onUpdate, onDelete }: ServiceCardProps) => {
  const IconComponent = Icons[service.icon as keyof typeof Icons];

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex items-center space-x-2 md:w-1/3">
            {IconComponent && <IconComponent className="h-5 w-5 text-salon-gray" />}
            <Input
              value={service.name}
              onChange={(e) => onUpdate({ ...service, name: e.target.value })}
              className="flex-1"
            />
          </div>
          
          <div className="flex space-x-4 md:w-2/3">
            <Select
              value={service.durationMinutes.toString()}
              onValueChange={(value) => 
                onUpdate({ ...service, durationMinutes: parseInt(value) })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration} value={duration.toString()}>
                    {duration} min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Input
                type="number"
                value={service.priceEur}
                onChange={(e) => 
                  onUpdate({ ...service, priceEur: parseFloat(e.target.value) })
                }
                className="pl-8"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-salon-gray">
                €
              </span>
            </div>

            <Button
              variant="ghost"
              className="text-salon-gray hover:text-destructive"
              onClick={() => onDelete(service.id)}
            >
              <Icons.Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};