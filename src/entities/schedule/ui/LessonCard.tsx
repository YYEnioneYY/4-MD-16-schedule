import { format } from 'date-fns';

import {
  BookOpenCheck,
  FlaskConical,
  MapPin,
  Presentation,
  UserRound,
  Video,
} from 'lucide-react';

import type {
  LessonType,
  ScheduleLesson,
} from '../model/types';

import { getLessonRuntimeState } from '../lib/get-lesson-runtime-state';

interface LessonCardProps {
  lesson: ScheduleLesson;
  selectedDate: Date;
  currentTime: Date;
  onClick: () => void;
}

interface LessonStyle {
  label: string;
  border: string;
  icon: string;
  badge: string;
  progress: string;
}

const LESSON_STYLES: Record<
  LessonType,
  LessonStyle
> = {
  LECTURE: {
    label: 'Лекция',
    border: 'border-l-indigo-500',
    icon: 'bg-indigo-50 text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-600',
    progress: 'bg-indigo-500',
  },

  PRACTICE: {
    label: 'Практика',
    border: 'border-l-emerald-500',
    icon: 'bg-emerald-50 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-600',
    progress: 'bg-emerald-500',
  },

  LABORATORY: {
    label: 'Лабораторная',
    border: 'border-l-amber-500',
    icon: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-600',
    progress: 'bg-amber-500',
  },
};

export function LessonCard({
  lesson,
  selectedDate,
  currentTime,
  onClick,
}: LessonCardProps) {
  const styles =
    LESSON_STYLES[lesson.lessonType];

  const runtime = getLessonRuntimeState(
    lesson,
    selectedDate,
    currentTime,
  );

  const isInProgress =
    runtime.status === 'IN_PROGRESS';

  const isFinished =
    runtime.status === 'FINISHED';

  const LessonIcon =
    lesson.lessonType === 'LECTURE'
      ? Presentation
      : lesson.lessonType === 'LABORATORY'
        ? FlaskConical
        : BookOpenCheck;

  const locationText =
    lesson.location.format === 'ONLINE'
      ? 'Дистанционное обучение · ДО'
      : [
          lesson.location.room,
          lesson.location.building,
        ]
          .filter(Boolean)
          .join(' · ');

  const LocationIcon =
    lesson.location.format === 'ONLINE'
      ? Video
      : MapPin;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={`Открыть подробности пары ${lesson.subject.name}`}
      className={[
        'relative w-full overflow-hidden rounded-2xl border border-l-4 border-slate-200 bg-white p-4 text-left shadow-sm transition sm:p-5',
        'focus:outline-none focus:ring-4 focus:ring-indigo-100',
        styles.border,
        isFinished
          ? 'opacity-60'
          : 'hover:-translate-y-0.5 hover:shadow-md',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            'flex size-12 shrink-0 items-center justify-center rounded-xl',
            styles.icon,
          ].join(' ')}
        >
          <LessonIcon
            size={24}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="text-lg font-bold leading-snug text-slate-900">
              {lesson.subject.name}
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  'inline-flex rounded-lg px-3 py-1 text-xs font-semibold',
                  styles.badge,
                ].join(' ')}
              >
                {styles.label}
              </span>

              {isInProgress && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500" />

                  Идёт сейчас
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <UserRound
                size={16}
                aria-hidden="true"
              />

              <span>
                {lesson.teacher.shortName}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-500">
              <LocationIcon
                size={16}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />

              <span>{locationText}</span>
            </div>
          </div>
        </div>
      </div>

      {isInProgress && (
        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={[
                'h-full rounded-full transition-[width] duration-1000',
                styles.progress,
              ].join(' ')}
              style={{
                width: `${runtime.progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-medium text-emerald-600">
              Пройдено {Math.round(runtime.progress)}%
            </span>

            <time className="font-medium text-slate-500">
              {format(currentTime, 'HH:mm')}
            </time>
          </div>
        </div>
      )}
    </button>
  );
}