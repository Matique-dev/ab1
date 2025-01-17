import { useRef } from "react";
import { useDayViewScroll } from "@/hooks/useDayViewScroll";

interface TimelineContainerProps {
  children: React.ReactNode;
  hourHeight: number;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const TimelineContainer = ({ 
  children, 
  hourHeight,
  onDoubleClick 
}: TimelineContainerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useDayViewScroll(scrollContainerRef, hourHeight);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative scroll-smooth"
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
};