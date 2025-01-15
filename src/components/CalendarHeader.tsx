import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  onDateChange: (date: Date) => void;
}

export const CalendarHeader = ({
  currentDate,
  view,
  onViewChange,
  onDateChange,
}: CalendarHeaderProps) => {
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "day":
        newDate.setDate(currentDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "day":
        newDate.setDate(currentDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    onDateChange(newDate);
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
      day: view === "day" ? "numeric" : undefined,
    };
    return currentDate.toLocaleDateString("en-US", options);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold ml-4">{formatDate()}</h2>
      </div>
      <div className="flex gap-2">
        <Button
          variant={view === "day" ? "default" : "outline"}
          onClick={() => onViewChange("day")}
          className="h-8"
        >
          Day
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          onClick={() => onViewChange("week")}
          className="h-8"
        >
          Week
        </Button>
        <Button
          variant={view === "month" ? "default" : "outline"}
          onClick={() => onViewChange("month")}
          className="h-8"
        >
          Month
        </Button>
      </div>
    </div>
  );
};