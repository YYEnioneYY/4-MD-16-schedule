import {
  useEffect,
  useRef,
} from 'react';

import type {
  ReactNode,
} from 'react';

import { createPortal } from 'react-dom';

import {
  format,
  isSameDay,
} from 'date-fns';

import { ru } from 'date-fns/locale';

import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  Clock3,
  FlaskConical,
  GraduationCap,
  MapPin,
  Presentation,
  UserRound,
  Video,
  X,
} from 'lucide-react';

import {
  getAcademicWeekInfo,
  type LessonType,
  type ScheduleLesson,
} from '@/entities/schedule';

interface LessonDetailsModalProps {
  lesson: ScheduleLesson | null;
  selectedDate: Date;
  currentTime: Date;
  isOpen: boolean;
  footerAction?: ReactNode;
  onClose: () => void;
}

const LESSON_TYPE_LABELS: Record<
  LessonType,
  string
> = {
  LECTURE: 'Лекция',
  PRACTICE: 'Практика',
  LABORATORY: 'Лабораторная',
};

const LESSON_TYPE_STYLES: Record<
  LessonType,
  {
    icon: string;
    badge: string;
    progress: string;
  }
> = {
  LECTURE: {
    icon: 'bg-indigo-50 text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-600',
    progress: 'bg-indigo-500',
  },

  PRACTICE: {
    icon: 'bg-emerald-50 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-600',
    progress: 'bg-emerald-500',
  },

  LABORATORY: {
    icon: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-600',
    progress: 'bg-amber-500',
  },
};

function createLessonDateTime(
  date: Date,
  time: string,
): Date {
  const [hours, minutes] = time
    .split(':')
    .map(Number);

  const result = new Date(date);

  result.setHours(
    hours,
    minutes,
    0,
    0,
  );

  return result;
}

function formatMinutes(
  minutes: number,
): string {
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
}

function capitalize(value: string): string {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export function LessonDetailsModal({
  lesson,
  selectedDate,
  currentTime,
  isOpen,
  footerAction,
  onClose,
}: LessonDetailsModalProps) {
  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    closeButtonRef.current?.focus();

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen || !lesson) {
    return null;
  }

  const styles =
    LESSON_TYPE_STYLES[lesson.lessonType];

  const LessonIcon =
    lesson.lessonType === 'LECTURE'
      ? Presentation
      : lesson.lessonType === 'LABORATORY'
        ? FlaskConical
        : BookOpenCheck;

  const startsAt = createLessonDateTime(
    selectedDate,
    lesson.time.start,
  );

  const endsAt = createLessonDateTime(
    selectedDate,
    lesson.time.end,
  );

  const currentTimestamp =
    currentTime.getTime();

  const startTimestamp =
    startsAt.getTime();

  const endTimestamp =
    endsAt.getTime();

  const isInProgress =
    currentTimestamp >= startTimestamp &&
    currentTimestamp < endTimestamp;

  const isUpcoming =
    currentTimestamp < startTimestamp;

  const isFinished =
    currentTimestamp >= endTimestamp;

  const durationMinutes = Math.round(
    (endTimestamp - startTimestamp) /
      60_000,
  );

  const progress = isInProgress
    ? Math.round(
        ((currentTimestamp -
          startTimestamp) /
          (endTimestamp -
            startTimestamp)) *
          100,
      )
    : isFinished
      ? 100
      : 0;

  let statusLabel = 'Запланирована';

  let statusDescription =
    'Занятие состоится по расписанию';

  let statusClassName =
    'bg-indigo-50 text-indigo-700';

  if (
    isUpcoming &&
    isSameDay(selectedDate, currentTime)
  ) {
    const minutesUntilStart =
      Math.max(
        1,
        Math.ceil(
          (startTimestamp -
            currentTimestamp) /
            60_000,
        ),
      );

    statusLabel = 'Скоро начнётся';

    statusDescription =
      `До начала ${formatMinutes(
        minutesUntilStart,
      )}`;
  }

  if (isInProgress) {
    const minutesUntilEnd =
      Math.max(
        1,
        Math.ceil(
          (endTimestamp -
            currentTimestamp) /
            60_000,
        ),
      );

    statusLabel = 'Идёт сейчас';

    statusDescription =
      `До окончания ${formatMinutes(
        minutesUntilEnd,
      )}`;

    statusClassName =
      'bg-emerald-50 text-emerald-700';
  }

  if (isFinished) {
    statusLabel = 'Завершилась';

    statusDescription =
      'Занятие уже закончилось';

    statusClassName =
      'bg-slate-100 text-slate-600';
  }

  const academicWeek =
    getAcademicWeekInfo(selectedDate);

  const selectedDateLabel = capitalize(
    format(
      selectedDate,
      'EEEE, d MMMM yyyy',
      {
        locale: ru,
      },
    ),
  );

  const weekLabel =
    academicWeek.parity === 'ODD'
      ? 'Нечётная неделя'
      : 'Чётная неделя';

  const repeatLabel =
    lesson.weekType === 'BOTH'
      ? 'Каждую неделю'
      : lesson.weekType === 'NUMERATOR'
        ? 'По числителю'
        : 'По знаменателю';

  const locationTitle =
    lesson.location.format === 'ONLINE'
      ? 'Дистанционное обучение'
      : lesson.location.room ??
        'Аудитория не указана';

  const locationDescription =
    lesson.location.format === 'ONLINE'
      ? 'Онлайн · ДО'
      : lesson.location.building ??
        'Адрес не указан';

  const LocationIcon =
    lesson.location.format === 'ONLINE'
      ? Video
      : MapPin;

  return createPortal(
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-modal-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <header className="flex items-start gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div
            className={[
              'flex size-12 shrink-0 items-center justify-center rounded-2xl',
              styles.icon,
            ].join(' ')}
          >
            <LessonIcon
              size={25}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={[
                'inline-flex rounded-lg px-3 py-1 text-xs font-semibold',
                styles.badge,
              ].join(' ')}
            >
              {
                LESSON_TYPE_LABELS[
                  lesson.lessonType
                ]
              }
            </span>

            <h2
              id="lesson-modal-title"
              className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl"
            >
              {lesson.subject.name}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </header>

        <div className="p-5 sm:p-6">
          <div
            className={[
              'rounded-2xl px-4 py-3',
              statusClassName,
            ].join(' ')}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {statusLabel}
                </p>

                <p className="mt-0.5 text-xs opacity-80">
                  {statusDescription}
                </p>
              </div>

              {isInProgress && (
                <span className="text-xl font-bold">
                  {progress}%
                </span>
              )}
            </div>

            {isInProgress && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
                <div
                  className={[
                    'h-full rounded-full transition-[width] duration-1000',
                    styles.progress,
                  ].join(' ')}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            )}
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <CalendarDays size={16} />

                Дата
              </dt>

              <dd className="mt-2 text-sm font-semibold text-slate-900">
                {selectedDateLabel}
              </dd>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock3 size={16} />

                Время
              </dt>

              <dd className="mt-2 text-sm font-semibold text-slate-900">
                {lesson.time.start}–
                {lesson.time.end}
              </dd>

              <p className="mt-1 text-xs text-slate-500">
                {formatMinutes(
                  durationMinutes,
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <UserRound size={16} />

                Преподаватель
              </dt>

              <dd className="mt-2 text-sm font-semibold text-slate-900">
                {lesson.teacher.shortName}
              </dd>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <GraduationCap size={16} />

                Кафедра
              </dt>

              <dd className="mt-2 text-sm font-semibold text-slate-900">
                {
                  lesson.subject
                    .departmentCode
                }
              </dd>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Building2 size={16} />

                Учебная неделя
              </dt>

              <dd className="mt-2 text-sm font-semibold text-slate-900">
                {weekLabel}
              </dd>

              <p className="mt-1 text-xs text-slate-500">
                {repeatLabel}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <LocationIcon size={16} />

                Место проведения
              </dt>

              <dd className="mt-2 text-sm font-semibold text-slate-900">
                {locationTitle}
              </dd>

              <p className="mt-1 text-xs text-slate-500">
                {locationDescription}
              </p>
            </div>
          </dl>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <BookOpenCheck
              size={18}
              className="text-indigo-500"
            />

            <div>
              <p className="text-xs text-slate-500">
                Объём занятий
              </p>

              <p className="text-sm font-semibold text-slate-900">
                {lesson.totalHours} ч
              </p>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-100 p-5 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {footerAction}
                      
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Закрыть
            </button>
          </div>
        </footer>
      </section>
    </div>,
    document.body,
  );
}