import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPlanning } from "@/components/business/TeamPlanning";
import { ExceptionDates } from "@/components/business/ExceptionDates";
import { ServicesManagement } from "@/components/business/ServicesManagement";
import { Clock, Users, Calendar, Scissors } from "lucide-react";
import { BusinessHours } from "@/components/business/BusinessHours";
import { useBusinessStore } from "@/hooks/useBusinessStore";

const Business = () => {
  const { businessHours, updateBusinessHours } = useBusinessStore();

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
            onScheduleChange={updateBusinessHours}
          />
        </CardContent>
      </Card>

      <TeamPlanning 
        initialBusinessHours={businessHours}
        onBusinessHoursChange={updateBusinessHours}
      />

      <Card>
        <CardHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Exception Dates</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Set special closure dates & hours
          </p>
        </CardHeader>
        <CardContent>
          <ExceptionDates businessHours={businessHours} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Services</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            List your services, standard duration and price
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