import type {
  GroupScheduleResponse,
  ScheduleLesson,
  Weekday,
} from '../model/types';

import { getAcademicWeekInfo } from '../model/semester';

const WEEKDAYS: readonly Weekday[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export function getLessonsForDate(
  schedule: GroupScheduleResponse,
  date: Date,
): ScheduleLesson[] {
  const weekday = WEEKDAYS[date.getDay()];
  const academicWeek = getAcademicWeekInfo(date);

  return schedule.lessons
    .filter((lesson) => {
      const isCorrectDay = lesson.weekday === weekday;

      const isCorrectWeek =
        lesson.weekType === 'BOTH' ||
        lesson.weekType === academicWeek.weekType;

      return isCorrectDay && isCorrectWeek;
    })
    .sort((firstLesson, secondLesson) =>
      firstLesson.time.start.localeCompare(
        secondLesson.time.start,
      ),
    );
}