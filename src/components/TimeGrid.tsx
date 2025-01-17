import React from 'react';
import { TimeLabels } from './timeline/TimeLabels';
import { GridLines } from './timeline/GridLines';

interface TimeGridProps {
  hours: number[];
  startHour: number;
  hourHeight: number;
  mode?: 'day' | 'week';
  dates?: Date[];
  timeColumnWidth: number;
}

export const TimeGrid = ({ 
  hours, 
  startHour, 
  hourHeight, 
  mode = 'day', 
  dates = [],
  timeColumnWidth,
}: TimeGridProps) => {
  return (
    <>
      <TimeLabels 
        hours={hours}
        hourHeight={hourHeight}
        timeColumnWidth={timeColumnWidth}
      />

      <div className="flex-1 relative">
        <div className="absolute inset-0">
          {mode === 'week' ? (
            <div className="flex h-full">
              {dates.map((date) => (
                <div 
                  key={date.toString()} 
                  className="flex-1 relative border-l first:border-l-0 border-gray-200"
                >
                  {hours.map((hour) => (
                    <GridLines
                      key={`${date}-${hour}`}
                      date={date}
                      hour={hour}
                      startHour={startHour}
                      hourHeight={hourHeight}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              {hours.map((hour) => (
                <GridLines
                  key={hour}
                  date={dates[0]}
                  hour={hour}
                  startHour={startHour}
                  hourHeight={hourHeight}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};