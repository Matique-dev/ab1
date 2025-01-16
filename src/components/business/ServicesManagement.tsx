import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { ServiceType, defaultServices } from '@/types/service';
import { useToast } from "@/components/ui/use-toast";

export const ServicesManagement = () => {
  const [services, setServices] = useState<ServiceType[]>(defaultServices);
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
    setServices([...services, newService]);
  };

  const handleUpdateService = (updatedService: ServiceType) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
    toast({
      title: "Service updated",
      description: `${updatedService.name} has been updated successfully.`,
    });
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Service deleted",
      description: "The service has been removed successfully.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Services</CardTitle>
        <Button onClick={handleAddService} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onUpdate={handleUpdateService}
            onDelete={handleDeleteService}
          />
        ))}
      </CardContent>
    </Card>
  );
};