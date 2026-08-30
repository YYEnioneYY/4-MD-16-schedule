import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  format,
  isSameDay,
} from 'date-fns';

import { ru } from 'date-fns/locale';

import {
  getGroupSchedule,
  getLessonRuntimeState,
  getLessonsForDate,
  LessonCard,
  type GroupScheduleResponse,
  type ScheduleLesson,
} from '@/entities/schedule';

import { useCurrentTime } from '@/shared/lib/hooks/use-current-time';

import {
  LessonDetailsModal,
} from '@/features/lesson-details';

interface DayScheduleProps {
  selectedDate: Date;
}

function getLessonsCountLabel(
  lessonsCount: number,
): string {
  const lastTwoDigits = lessonsCount % 100;
  const lastDigit = lessonsCount % 10;

  if (
    lastTwoDigits >= 11 &&
    lastTwoDigits <= 14
  ) {
    return `${lessonsCount} пар`;
  }

  if (lastDigit === 1) {
    return `${lessonsCount} пара`;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4
  ) {
    return `${lessonsCount} пары`;
  }

  return `${lessonsCount} пар`;
}

export function DaySchedule({
  selectedDate,
}: DayScheduleProps) {
  const [schedule, setSchedule] =
    useState<GroupScheduleResponse | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const currentTime = useCurrentTime();

  const [
    selectedLesson,
    setSelectedLesson,
  ] = useState<ScheduleLesson | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSchedule() {
      try {
        setIsLoading(true);
        setError(null);

        const scheduleData =
          await getGroupSchedule();

        if (isMounted) {
          setSchedule(scheduleData);
        }
      } catch {
        if (isMounted) {
          setError(
            'Не удалось загрузить расписание',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSchedule();

    return () => {
      isMounted = false;
    };
  }, []);

  const lessons = useMemo(() => {
    if (!schedule) {
      return [];
    }

    return getLessonsForDate(
      schedule,
      selectedDate,
    );
  }, [schedule, selectedDate]);

  const title = isSameDay(
    selectedDate,
    currentTime,
  )
    ? 'Расписание на сегодня'
    : `Расписание на ${format(
        selectedDate,
        'd MMMM',
        {
          locale: ru,
        },
      )}`;

  if (isLoading) {
    return (
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-100" />

        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-slate-100"
              />
            ),
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
          {getLessonsCountLabel(
            lessons.length,
          )}
        </span>
      </header>

      {lessons.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="font-semibold text-slate-700">
            На этот день занятий нет
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Можно отдохнуть или подготовиться к следующим парам
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {lessons.map((lesson) => {
            const runtime =
              getLessonRuntimeState(
                lesson,
                selectedDate,
                currentTime,
              );

            const isInProgress =
              runtime.status === 'IN_PROGRESS';

            const isFinished =
              runtime.status === 'FINISHED';

            return (
              <div
                key={lesson.id}
                className="grid gap-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-4"
              >
                <div className="flex items-center gap-2 sm:justify-end sm:self-start sm:pt-8">
                  <time
                    className={[
                      'whitespace-nowrap text-sm font-medium',
                      isInProgress
                        ? 'text-indigo-600'
                        : 'text-slate-500',
                    ].join(' ')}
                  >
                    {lesson.time.start}–
                    {lesson.time.end}
                  </time>

                  <span
                    className={[
                      'size-3 shrink-0 rounded-full border-2',
                      isInProgress
                        ? 'border-indigo-200 bg-indigo-600 ring-4 ring-indigo-100'
                        : isFinished
                          ? 'border-slate-300 bg-slate-300'
                          : 'border-slate-300 bg-white',
                    ].join(' ')}
                  />
                </div>

                <LessonCard
                  lesson={lesson}
                  selectedDate={selectedDate}
                  currentTime={currentTime}
                  onClick={() => {
                    setSelectedLesson(lesson);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      <LessonDetailsModal
        lesson={selectedLesson}
        selectedDate={selectedDate}
        currentTime={currentTime}
        isOpen={selectedLesson !== null}
        onClose={() => {
          setSelectedLesson(null);
        }}
      />
    </section>
  );
}