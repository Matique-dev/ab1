import { TimeColumn } from './timeline/TimeColumn';
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
      <TimeColumn hours={hours} timeColumnWidth={timeColumnWidth} />
      <GridLines 
        hours={hours}
        startHour={startHour}
        hourHeight={hourHeight}
        mode={mode}
        dates={dates}
      />
    </>
  );
};