import { isSameDay } from 'date-fns';

import type { ScheduleLesson } from '../model/types';

export type LessonRuntimeStatus =
  | 'DEFAULT'
  | 'UPCOMING'
  | 'IN_PROGRESS'
  | 'FINISHED';

export interface LessonRuntimeState {
  status: LessonRuntimeStatus;
  progress: number;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time
    .split(':')
    .map(Number);

  return hours * 60 + minutes;
}

function getCurrentMinutes(date: Date): number {
  return (
    date.getHours() * 60 +
    date.getMinutes() +
    date.getSeconds() / 60
  );
}

export function getLessonRuntimeState(
  lesson: ScheduleLesson,
  selectedDate: Date,
  currentTime: Date,
): LessonRuntimeState {
  if (!isSameDay(selectedDate, currentTime)) {
    return {
      status: 'DEFAULT',
      progress: 0,
    };
  }

  const startMinutes = timeToMinutes(
    lesson.time.start,
  );

  const endMinutes = timeToMinutes(
    lesson.time.end,
  );

  const currentMinutes = getCurrentMinutes(
    currentTime,
  );

  if (currentMinutes < startMinutes) {
    return {
      status: 'UPCOMING',
      progress: 0,
    };
  }

  if (currentMinutes >= endMinutes) {
    return {
      status: 'FINISHED',
      progress: 100,
    };
  }

  const lessonDuration =
    endMinutes - startMinutes;

  const elapsedTime =
    currentMinutes - startMinutes;

  const progress =
    (elapsedTime / lessonDuration) * 100;

  return {
    status: 'IN_PROGRESS',
    progress: Math.min(
      100,
      Math.max(0, progress),
    ),
  };
}