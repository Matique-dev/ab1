import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { ServiceType } from '@/types/service';
import { useToast } from "@/hooks/use-toast";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

export const ServicesManagement = () => {
  const { services, updateServices } = useBusinessStore();
  const { toast } = useToast();

  const handleAddService = () => {
    const newService: ServiceType = {
      id: Date.now().toString(),
      name: "New Service",
      icon: 'scissors',
      durationMinutes: 30,
      priceEur: 0,
      category: 'haircuts'
    };
    
    const updatedServices = [...services, newService];
    updateServices(updatedServices);
    
    toast({
      title: "Service added",
      description: "A new service has been added successfully.",
    });
  };

  const handleUpdateService = (updatedService: ServiceType) => {
    const updatedServices = services.map(service => 
      service.id === updatedService.id ? updatedService : service
    );
    updateServices(updatedServices);
    toast({
      title: "Service updated",
      description: `${updatedService.name} has been updated successfully.`,
    });
  };

  const handleDeleteService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    updateServices(updatedServices);
    toast({
      title: "Service deleted",
      description: "The service has been removed successfully.",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((service) => service.id === active.id);
      const newIndex = services.findIndex((service) => service.id === over.id);
      
      const reorderedServices = arrayMove(services, oldIndex, newIndex);
      updateServices(reorderedServices);
      
      toast({
        title: "Services reordered",
        description: "The service order has been updated successfully.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onUpdate={handleUpdateService}
              onDelete={handleDeleteService}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button onClick={handleAddService}>
        <Plus className="mr-2 h-4 w-4" /> Add Service
      </Button>
    </div>
  );
};