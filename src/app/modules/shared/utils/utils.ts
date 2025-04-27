import { EWeekDayNames } from './e-week-day-names';

export namespace Types {
  export type ServiceResult<T> = Promise<T>;
}

export function getWeekDayName(day: number): string {
  return EWeekDayNames[day];
}

/**
 * Находит n дат через равные интервалы в массиве timestamp
 *
 * @param timestamps - Массив timestamp
 * @param count - Количество дат для поиска
 * @returns Массив найденных дат
 */
export function getEvenlySpacedDates(
  timestamps: number[],
  count: number
): number[] {
  if (timestamps.length === 0 || count <= 0) {
    return [];
  }

  // Сортируем массив по возрастанию
  const sortedTimestamps = [...timestamps].sort((a, b) => a - b);

  // Если запрашиваем больше дат, чем есть в массиве, возвращаем все даты
  if (count >= sortedTimestamps.length) {
    return sortedTimestamps;
  }

  const result: number[] = [];
  const step = (sortedTimestamps.length - 1) / (count - 1);

  for (let i = 0; i < count; i++) {
    const index = Math.round(i * step);
    result.push(sortedTimestamps[index]);
  }

  return result;
}
