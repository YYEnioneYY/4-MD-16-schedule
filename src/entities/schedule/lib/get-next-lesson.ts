import {
  addDays,
  isAfter,
  isBefore,
  startOfDay,
} from 'date-fns';

import {
  SEMESTER_END,
  SEMESTER_START,
} from '../model/semester';

import type {
  GroupScheduleResponse,
  ScheduleLesson,
} from '../model/types';

import {
  getLessonsForDate,
} from './get-lessons-for-date';

export interface NextLessonInfo {
  lesson: ScheduleLesson;
  date: Date;
  startsAt: Date;
  minutesUntil: number;
}

function createLessonDate(
  date: Date,
  time: string,
): Date {
  const [hours, minutes] = time
    .split(':')
    .map(Number);

  const lessonDate = new Date(date);

  lessonDate.setHours(
    hours,
    minutes,
    0,
    0,
  );

  return lessonDate;
}

export function getNextLesson(
  schedule: GroupScheduleResponse,
  currentTime: Date,
): NextLessonInfo | null {
  const currentDate = startOfDay(currentTime);

  if (isAfter(currentDate, SEMESTER_END)) {
    return null;
  }

  let checkedDate = isBefore(
    currentDate,
    SEMESTER_START,
  )
    ? SEMESTER_START
    : currentDate;

  while (!isAfter(checkedDate, SEMESTER_END)) {
    const lessons = getLessonsForDate(
      schedule,
      checkedDate,
    );

    for (const lesson of lessons) {
      const startsAt = createLessonDate(
        checkedDate,
        lesson.time.start,
      );

      if (isAfter(startsAt, currentTime)) {
        const millisecondsUntil =
          startsAt.getTime() -
          currentTime.getTime();

        const minutesUntil = Math.ceil(
          millisecondsUntil / 60_000,
        );

        return {
          lesson,
          date: new Date(checkedDate),
          startsAt,
          minutesUntil,
        };
      }
    }

    checkedDate = addDays(checkedDate, 1);
  }

  return null;
}