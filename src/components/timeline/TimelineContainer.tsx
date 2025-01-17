import React, { RefObject } from 'react';

interface TimelineContainerProps {
  children: React.ReactNode;
  scrollRef: RefObject<HTMLDivElement>;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const TimelineContainer = ({ 
  children, 
  scrollRef, 
  onDoubleClick 
}: TimelineContainerProps) => {
  return (
    <div 
      ref={scrollRef}
      className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative scroll-smooth"
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
};