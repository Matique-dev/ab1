import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CalendarX2, Clock } from "lucide-react";

type ExceptionDate = {
  date: Date;
  isAllDayOff: boolean;
  openTime?: string;
  closeTime?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export const ExceptionDates = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [exceptions, setExceptions] = React.useState<ExceptionDate[]>([]);
  const [isAllDayOff, setIsAllDayOff] = React.useState(true);
  const [openTime, setOpenTime] = React.useState("09:00");
  const [closeTime, setCloseTime] = React.useState("17:00");

  const handleAddException = () => {
    if (!selectedDate) return;

    const newException: ExceptionDate = {
      date: selectedDate,
      isAllDayOff,
      ...(isAllDayOff ? {} : { openTime, closeTime }),
    };

    setExceptions((prev) => [...prev, newException]);
    setSelectedDate(undefined);
    
    toast({
      title: "Exception added",
      description: "The business hours exception has been added successfully.",
    });
  };

  const handleRemoveException = (date: Date) => {
    setExceptions((prev) => prev.filter((ex) => ex.date.getTime() !== date.getTime()));
    toast({
      title: "Exception removed",
      description: "The business hours exception has been removed successfully.",
    });
  };

  // Disable dates that already have exceptions
  const disabledDays = exceptions.map((ex) => ex.date);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Select Exception Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledDays}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Exception Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">All Day Off</label>
                <Switch
                  checked={isAllDayOff}
                  onCheckedChange={setIsAllDayOff}
                />
              </div>

              {!isAllDayOff && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Opening Time</label>
                    <Select value={openTime} onValueChange={setOpenTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select opening time" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((hour) => (
                          <SelectItem key={hour.value} value={hour.value}>
                            {hour.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Closing Time</label>
                    <Select value={closeTime} onValueChange={setCloseTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select closing time" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((hour) => (
                          <SelectItem key={hour.value} value={hour.value}>
                            {hour.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddException}
                disabled={!selectedDate}
                className="w-full"
              >
                Add Exception
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Scheduled Exceptions</h3>
        {exceptions.length === 0 ? (
          <p className="text-muted-foreground">No exceptions scheduled.</p>
        ) : (
          <div className="space-y-2">
            {exceptions.map((exception) => (
              <div
                key={exception.date.toISOString()}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  {exception.isAllDayOff ? (
                    <CalendarX2 className="h-5 w-5 text-destructive" />
                  ) : (
                    <Clock className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">
                      {exception.date.toLocaleDateString()}
                    </p>
                    {!exception.isAllDayOff && (
                      <p className="text-sm text-muted-foreground">
                        {exception.openTime} - {exception.closeTime}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveException(exception.date)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};