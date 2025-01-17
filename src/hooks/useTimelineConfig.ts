export const useTimelineConfig = (mode: 'day' | 'week') => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 9);
  const HOUR_HEIGHT = 100;
  const START_HOUR = 9;
  const PAGE_MARGIN_PERCENT = mode === 'day' ? 2.5 : 0.5;
  const TIME_COLUMN_WIDTH = mode === 'week' ? 48 : 64;

  return {
    hours,
    HOUR_HEIGHT,
    START_HOUR,
    PAGE_MARGIN_PERCENT,
    TIME_COLUMN_WIDTH,
  };
};