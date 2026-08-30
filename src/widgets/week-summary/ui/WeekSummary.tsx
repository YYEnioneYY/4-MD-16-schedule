import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  format,
  isSameWeek,
} from 'date-fns';

import { ru } from 'date-fns/locale';

import {
  BookOpen,
  FlaskConical,
  TrendingUp,
} from 'lucide-react';

import {
  getGroupSchedule,
  getWeekSummary,
  type GroupScheduleResponse,
} from '@/entities/schedule';

import {
  useCurrentTime,
} from '@/shared/lib/hooks/use-current-time';

interface WeekSummaryWidgetProps {
  selectedDate: Date;
}

function getPairLabel(
  count: number,
): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (
    lastTwoDigits >= 11 &&
    lastTwoDigits <= 14
  ) {
    return 'пар';
  }

  if (lastDigit === 1) {
    return 'пара';
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4
  ) {
    return 'пары';
  }

  return 'пар';
}

function getLaboratoryLabel(
  count: number,
): string {
  if (count === 1) {
    return 'лабораторная';
  }

  if (
    count >= 2 &&
    count <= 4
  ) {
    return 'лабораторные';
  }

  return 'лабораторных';
}

function formatWeekRange(
  start: Date,
  end: Date,
): string {
  const formattedStart = format(
    start,
    'd MMM',
    {
      locale: ru,
    },
  ).replaceAll('.', '');

  const formattedEnd = format(
    end,
    'd MMM',
    {
      locale: ru,
    },
  ).replaceAll('.', '');

  return `${formattedStart} — ${formattedEnd}`;
}

export function WeekSummaryWidget({
  selectedDate,
}: WeekSummaryWidgetProps) {
  const [schedule, setSchedule] =
    useState<GroupScheduleResponse | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const currentTime = useCurrentTime();

  useEffect(() => {
    let isMounted = true;

    async function loadSchedule() {
      try {
        const scheduleData =
          await getGroupSchedule();

        if (isMounted) {
          setSchedule(scheduleData);
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

  const summary = useMemo(() => {
    if (!schedule) {
      return null;
    }

    return getWeekSummary(
      schedule,
      selectedDate,
      currentTime,
    );
  }, [
    schedule,
    selectedDate,
    currentTime,
  ]);

  if (isLoading || !summary) {
    return (
      <aside className="h-52 animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-5 w-32 rounded bg-slate-100" />

        <div className="mt-6 h-24 rounded-xl bg-slate-100" />
      </aside>
    );
  }

  const isCurrentWeek = isSameWeek(
    selectedDate,
    currentTime,
    {
      weekStartsOn: 1,
    },
  );

  const weekTypeLabel =
    summary.weekType === 'NUMERATOR'
      ? 'Числитель'
      : 'Знаменатель';

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header>
        <h2 className="font-bold text-slate-900">
          {isCurrentWeek
            ? 'Эта неделя'
            : `Неделя №${summary.weekNumber}`}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {weekTypeLabel}
          {' · '}
          {formatWeekRange(
            summary.weekStart,
            summary.weekEnd,
          )}
        </p>
      </header>

      <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100">
        <div className="flex flex-col items-center px-2 text-center">
          <BookOpen
            size={20}
            className="text-indigo-500"
            aria-hidden="true"
          />

          <span className="mt-2 text-xl font-bold text-slate-900">
            {summary.totalLessons}
          </span>

          <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
            {getPairLabel(
              summary.totalLessons,
            )}
          </span>
        </div>

        <div className="flex flex-col items-center px-2 text-center">
          <FlaskConical
            size={20}
            className="text-amber-500"
            aria-hidden="true"
          />

          <span className="mt-2 text-xl font-bold text-slate-900">
            {summary.laboratories}
          </span>

          <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
            {getLaboratoryLabel(
              summary.laboratories,
            )}
          </span>
        </div>

        <div className="flex flex-col items-center px-2 text-center">
          <TrendingUp
            size={20}
            className="text-emerald-500"
            aria-hidden="true"
          />

          <span className="mt-2 text-xl font-bold text-slate-900">
            {summary.progress}%
          </span>

          <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
            пройдено
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-[width] duration-1000"
            style={{
              width: `${summary.progress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>
            Завершено{' '}
            {summary.completedLessons} из{' '}
            {summary.totalLessons}
          </span>

          <span>
            {summary.studyDays}{' '}
            учебных дня
          </span>
        </div>
      </div>
    </aside>
  );
}