import {
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
} from 'date-fns';

import {
  getAcademicWeekInfo,
  isDateInsideSemester,
} from '../model/semester';

import type {
  GroupScheduleResponse,
  WeekType,
} from '../model/types';

import {
  getLessonsForDate,
} from './get-lessons-for-date';

export interface WeekSummary {
  weekNumber: number;
  weekType: Exclude<WeekType, 'BOTH'>;

  weekStart: Date;
  weekEnd: Date;

  totalLessons: number;
  completedLessons: number;
  laboratories: number;
  studyDays: number;

  progress: number;
}

function createLessonDateTime(
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

export function getWeekSummary(
  schedule: GroupScheduleResponse,
  selectedDate: Date,
  currentTime: Date,
): WeekSummary {
  const weekStart = startOfWeek(
    selectedDate,
    {
      weekStartsOn: 1,
    },
  );

  const weekEnd = endOfWeek(
    selectedDate,
    {
      weekStartsOn: 1,
    },
  );

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  const academicWeek =
    getAcademicWeekInfo(selectedDate);

  let totalLessons = 0;
  let completedLessons = 0;
  let laboratories = 0;
  let studyDays = 0;

  let totalDuration = 0;
  let completedDuration = 0;

  for (const date of weekDays) {
    if (!isDateInsideSemester(date)) {
      continue;
    }

    const lessons = getLessonsForDate(
      schedule,
      date,
    );

    if (lessons.length > 0) {
      studyDays += 1;
    }

    for (const lesson of lessons) {
      totalLessons += 1;

      if (
        lesson.lessonType === 'LABORATORY'
      ) {
        laboratories += 1;
      }

      const startsAt =
        createLessonDateTime(
          date,
          lesson.time.start,
        );

      const endsAt =
        createLessonDateTime(
          date,
          lesson.time.end,
        );

      const lessonDuration =
        endsAt.getTime() -
        startsAt.getTime();

      totalDuration += lessonDuration;

      if (
        currentTime.getTime() >=
        endsAt.getTime()
      ) {
        completedLessons += 1;
        completedDuration += lessonDuration;

        continue;
      }

      if (
        currentTime.getTime() >
        startsAt.getTime()
      ) {
        completedDuration +=
          currentTime.getTime() -
          startsAt.getTime();
      }
    }
  }

  const progress =
    totalDuration === 0
      ? 0
      : Math.round(
          (completedDuration /
            totalDuration) *
            100,
        );

  return {
    weekNumber: academicWeek.number,
    weekType: academicWeek.weekType,

    weekStart,
    weekEnd,

    totalLessons,
    completedLessons,
    laboratories,
    studyDays,

    progress: Math.min(
      100,
      Math.max(0, progress),
    ),
  };
}