import React, { RefObject } from 'react';

interface TimelineContainerProps {
  children: React.ReactNode;
  scrollRef: RefObject<HTMLDivElement>;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string; // Added className as an optional prop
}

export const TimelineContainer = ({ 
  children, 
  scrollRef, 
  onDoubleClick,
  className = '' // Default to empty string if not provided
}: TimelineContainerProps) => {
  return (
    <div 
      ref={scrollRef}
      className={`flex flex-col h-[calc(100vh-12rem)] overflow-y-auto relative scroll-smooth ${className}`}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
};