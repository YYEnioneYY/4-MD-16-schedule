import {
  differenceInCalendarDays,
  endOfWeek,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from 'date-fns';

import type { WeekType } from './types';

export type AcademicWeekParity = 'ODD' | 'EVEN';

export interface AcademicWeekInfo {
  number: number;
  parity: AcademicWeekParity;
  weekType: Exclude<WeekType, 'BOTH'>;
}

export const SEMESTER_START = startOfDay(
  new Date(2026, 8, 1),
);

export const SEMESTER_END = startOfDay(
  new Date(2026, 11, 27),
);

export const FIRST_SEMESTER_WEEK_START = startOfWeek(
  SEMESTER_START,
  {
    weekStartsOn: 1,
  },
);

export const LAST_SEMESTER_WEEK_START = startOfWeek(
  SEMESTER_END,
  {
    weekStartsOn: 1,
  },
);

export const LAST_SEMESTER_WEEK_END = endOfWeek(
  SEMESTER_END,
  {
    weekStartsOn: 1,
  },
);

export function isDateInsideSemester(date: Date): boolean {
  return isWithinInterval(startOfDay(date), {
    start: SEMESTER_START,
    end: SEMESTER_END,
  });
}

export function getInitialScheduleDate(
  currentDate = new Date(),
): Date {
  const date = startOfDay(currentDate);

  if (isBefore(date, SEMESTER_START)) {
    return SEMESTER_START;
  }

  if (isAfter(date, SEMESTER_END)) {
    return SEMESTER_END;
  }

  return date;
}

export function getAcademicWeekInfo(
  date: Date,
): AcademicWeekInfo {
  const selectedWeekStart = startOfWeek(date, {
    weekStartsOn: 1,
  });

  const passedDays = differenceInCalendarDays(
    selectedWeekStart,
    FIRST_SEMESTER_WEEK_START,
  );

  const academicWeekNumber = Math.floor(passedDays / 7) + 1;
  const isOddWeek = academicWeekNumber % 2 !== 0;

  return {
    number: academicWeekNumber,

    parity: isOddWeek
      ? 'ODD'
      : 'EVEN',

    weekType: isOddWeek
      ? 'NUMERATOR'
      : 'DENOMINATOR',
  };
}