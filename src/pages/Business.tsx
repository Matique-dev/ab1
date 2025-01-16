import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeManagement } from "@/components/business/EmployeeManagement";
import { BusinessHours } from "@/components/business/BusinessHours";
import { ExceptionDates } from "@/components/business/ExceptionDates";
import { ServicesManagement } from "@/components/business/ServicesManagement";

const Business = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee Management</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeManagement />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle>Business Hours</CardTitle>
          <p className="text-sm text-salon-gray">Set the opening hours for your business, during your standard week.</p>
        </CardHeader>
        <CardContent>
          <BusinessHours />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle>Exception Dates</CardTitle>
          <p className="text-sm text-salon-gray">Define exceptions to your Business Hours, such as planned business holidays and days where business hours are different than the standard.</p>
        </CardHeader>
        <CardContent>
          <ExceptionDates />
        </CardContent>
      </Card>

      <ServicesManagement />
    </div>
  );
};

export default Business;