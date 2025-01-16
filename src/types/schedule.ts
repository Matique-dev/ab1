export type DaySchedule = {
  isAvailable: boolean;
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
};

export type WeekSchedule = {
  [key: string]: {
    isAvailable: boolean;
    openTime: string;
    closeTime: string;
  };
};

export interface Employee {
  id: string;
  name: string;
  color: string;
  schedule: {
    [key: string]: DaySchedule;
  };
}