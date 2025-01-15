import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeManagement } from "@/components/business/EmployeeManagement";

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

      {/* Other sections will be added here later */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>

      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Exception Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>

      <Card className="opacity-50">
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Business;
