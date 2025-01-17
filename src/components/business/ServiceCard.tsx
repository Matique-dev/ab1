import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceType } from '@/types/service';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import { ServiceNameInput } from './service/ServiceNameInput';
import { DurationSelect } from './service/DurationSelect';
import { PriceInput } from './service/PriceInput';

interface ServiceCardProps {
  service: ServiceType;
  onUpdate: (updatedService: ServiceType) => void;
  onDelete: (id: string) => void;
}

export const ServiceCard = ({ service, onUpdate, onDelete }: ServiceCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <Button
              variant="ghost"
              className="cursor-grab active:cursor-grabbing md:mt-1"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5 text-salon-gray" />
            </Button>

            <ServiceNameInput
              value={service.name}
              icon={service.icon as 'scissors' | 'brush' | 'droplet'}
              onChange={(name) => onUpdate({ ...service, name })}
            />
            
            <div className="flex space-x-4 md:w-2/3">
              <DurationSelect
                value={service.durationMinutes}
                onChange={(durationMinutes) => onUpdate({ ...service, durationMinutes })}
              />

              <PriceInput
                value={service.priceEur}
                onChange={(priceEur) => onUpdate({ ...service, priceEur })}
              />

              <Button
                variant="ghost"
                className="text-salon-gray hover:text-destructive"
                onClick={() => onDelete(service.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};