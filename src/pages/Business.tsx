import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPlanning, DEFAULT_BUSINESS_HOURS } from "@/components/business/TeamPlanning";
import { ExceptionDates } from "@/components/business/ExceptionDates";
import { ServicesManagement } from "@/components/business/ServicesManagement";
import { WeekSchedule } from "@/types/schedule";
import { useToast } from "@/hooks/use-toast";

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
      
      <TeamPlanning 
        initialBusinessHours={businessHours}
        onBusinessHoursChange={handleBusinessHoursChange}
      />

      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle>Exception Dates</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define exceptions to your Business Hours, such as planned business holidays and days where business hours are different than the standard.
          </p>
        </CardHeader>
        <CardContent>
          <ExceptionDates businessHours={businessHours} />
        </CardContent>
      </Card>

      <ServicesManagement />
    </div>
  );
};

export default Business;