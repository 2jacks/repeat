import { EWeekDayNames } from './e-week-day-names';

export namespace Types {
  export type ServiceResult<T> = Promise<T>;
}

export function getWeekDayName(day: number): string {
  return EWeekDayNames[day];
}
