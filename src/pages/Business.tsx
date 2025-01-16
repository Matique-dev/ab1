import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPlanning, DEFAULT_BUSINESS_HOURS } from "@/components/business/TeamPlanning";
import { ExceptionDates } from "@/components/business/ExceptionDates";
import { ServicesManagement } from "@/components/business/ServicesManagement";
import { WeekSchedule } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";
import { BusinessHours } from "@/components/business/BusinessHours";
import { Clock, Users, Calendar, Server } from "lucide-react";

const Business = () => {
  const [businessHours, setBusinessHours] = useState<WeekSchedule>(DEFAULT_BUSINESS_HOURS);
  const { toast } = useToast();

  const handleBusinessHoursChange = (newSchedule: WeekSchedule) => {
    setBusinessHours(newSchedule);
    toast({
      title: "Business hours updated",
      description: "Your business hours have been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
      
      <Card>
        <CardHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Business Hours</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Set your business operating hours for each day of the week
          </p>
        </CardHeader>
        <CardContent>
          <BusinessHours 
            initialSchedule={businessHours}
            onScheduleChange={handleBusinessHoursChange}
          />
        </CardContent>
      </Card>

      <TeamPlanning 
        initialBusinessHours={businessHours}
        onBusinessHoursChange={handleBusinessHoursChange}
      />

      <Card>
        <CardHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Exception Dates</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Define exceptions to your Business Hours, such as planned business holidays and days where business hours are different than the standard.
          </p>
        </CardHeader>
        <CardContent>
          <ExceptionDates businessHours={businessHours} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Services Management</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage the services your business offers
          </p>
        </CardHeader>
        <CardContent>
          <ServicesManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default Business;