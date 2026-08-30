import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isWeekend,
  startOfDay,
  startOfWeek,
} from 'date-fns';

import { ru } from 'date-fns/locale';

import {
  FIRST_SEMESTER_WEEK_START,
  LAST_SEMESTER_WEEK_START,
  getAcademicWeekInfo,
  isDateInsideSemester,
} from '@/entities/schedule';

import {
  getCurrentDateTime,
} from '@/shared/config/date-time';

const WEEKDAY_SHORT_NAMES = [
  'Вс',
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
];

interface WeekNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatWeekRange(
  startDate: Date,
  endDate: Date,
): string {
  const start = format(startDate, 'd MMM', {
    locale: ru,
  }).replaceAll('.', '');

  const end = format(endDate, 'd MMMM', {
    locale: ru,
  });

  return `${start} — ${end}`;
}

export function WeekNavigation({
  selectedDate,
  onDateChange,
}: WeekNavigationProps) {
  const today = startOfDay(
    getCurrentDateTime(),
  );

  const weekStart = startOfWeek(selectedDate, {
    weekStartsOn: 1,
  });

  const weekEnd = endOfWeek(selectedDate, {
    weekStartsOn: 1,
  });

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  const academicWeek = getAcademicWeekInfo(weekStart);

  const canShowPreviousWeek = isBefore(
    FIRST_SEMESTER_WEEK_START,
    weekStart,
  );

  const canShowNextWeek = isBefore(
    weekStart,
    LAST_SEMESTER_WEEK_START,
  );

  const handlePreviousWeek = () => {
    if (!canShowPreviousWeek) {
      return;
    }

    onDateChange(addWeeks(selectedDate, -1));
  };

  const handleNextWeek = () => {
    if (!canShowNextWeek) {
      return;
    }

    onDateChange(addWeeks(selectedDate, 1));
  };

  const handleDateChange = (date: Date) => {
    if (!isDateInsideSemester(date)) {
      return;
    }

    onDateChange(date);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <button
            type="button"
            onClick={handlePreviousWeek}
            disabled={!canShowPreviousWeek}
            aria-label="Предыдущая неделя"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div className="min-w-0 text-center sm:min-w-60">
            <p className="text-lg font-bold text-slate-900 sm:text-xl">
              {formatWeekRange(weekStart, weekEnd)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Учебная неделя №{academicWeek.number}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextWeek}
            disabled={!canShowNextWeek}
            aria-label="Следующая неделя"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 px-4 py-3">
          <span className="size-3 rounded-full bg-indigo-600" />

          <div>
            <p className="font-semibold text-indigo-950">
              {academicWeek.parity === 'ODD'
                ? 'Нечётная неделя'
                : 'Чётная неделя'}
            </p>

            <p className="text-sm text-indigo-600">
              {academicWeek.weekType === 'NUMERATOR'
                ? 'Числитель'
                : 'Знаменатель'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-3">
        {weekDays.map((date) => {
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          const isAvailable = isDateInsideSemester(date);
          const isWeekendDay = isWeekend(date);

          const dayName = WEEKDAY_SHORT_NAMES[date.getDay()];

          const fullDate = format(
            date,
            'd MMMM yyyy, EEEE',
            {
              locale: ru,
            },
          );

          let stateClassName =
            'border-slate-200 bg-white text-slate-800 hover:border-indigo-200 hover:bg-indigo-50';

          if (isSelected) {
            stateClassName =
              'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100';
          }

          if (isToday) {
            stateClassName =
              'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200';
          }

          if (!isAvailable) {
            stateClassName =
              'cursor-not-allowed border-transparent bg-slate-50 text-slate-300';
          }

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={!isAvailable}
              onClick={() => handleDateChange(date)}
              aria-label={fullDate}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              className={[
                'flex min-h-24 flex-col items-center justify-center rounded-2xl border px-1 py-3 transition sm:min-h-28',
                stateClassName,
              ].join(' ')}
            >
              <span
                className={[
                  'text-xs font-semibold sm:text-sm',
                  isWeekendDay && !isToday
                    ? 'text-rose-400'
                    : '',
                ].join(' ')}
              >
                {dayName}
              </span>

              <span className="mt-1 text-2xl font-bold sm:text-3xl">
                {format(date, 'd')}
              </span>

              {isToday && (
                <>
                  <span className="mt-1 hidden text-[10px] font-semibold sm:block">
                    Сегодня
                  </span>

                  <span className="mt-2 size-1.5 rounded-full bg-white sm:hidden" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}