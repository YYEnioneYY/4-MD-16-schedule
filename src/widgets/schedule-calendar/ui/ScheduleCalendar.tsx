import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import { ru } from 'date-fns/locale';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  SEMESTER_END,
  SEMESTER_START,
  getAcademicWeekInfo,
  getGroupSchedule,
  getLessonsForDate,
  isDateInsideSemester,
  type GroupScheduleResponse,
} from '@/entities/schedule';

import {
  getCurrentDateTime,
} from '@/shared/config/date-time';

interface ScheduleCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WEEKDAY_NAMES = [
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
  'Вс',
];

const FIRST_SEMESTER_MONTH =
  startOfMonth(SEMESTER_START);

const LAST_SEMESTER_MONTH =
  startOfMonth(SEMESTER_END);

function capitalize(value: string): string {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function ScheduleCalendar({
  selectedDate,
  onDateChange,
}: ScheduleCalendarProps) {
  const [displayedMonth, setDisplayedMonth] =
    useState(() => startOfMonth(selectedDate));

  const [schedule, setSchedule] =
    useState<GroupScheduleResponse | null>(null);

  const today = getCurrentDateTime();

  useEffect(() => {
    setDisplayedMonth(
      startOfMonth(selectedDate),
    );
  }, [selectedDate]);

  useEffect(() => {
    let isMounted = true;

    async function loadSchedule() {
      const scheduleData =
        await getGroupSchedule();

      if (isMounted) {
        setSchedule(scheduleData);
      }
    }

    void loadSchedule();

    return () => {
      isMounted = false;
    };
  }, []);

  const calendarStart = startOfWeek(
    startOfMonth(displayedMonth),
    {
      weekStartsOn: 1,
    },
  );

  const calendarEnd = endOfWeek(
    endOfMonth(displayedMonth),
    {
      weekStartsOn: 1,
    },
  );

  const calendarDays = useMemo(
    () =>
      eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
      }),
    [calendarStart, calendarEnd],
  );

  const calendarWeeks = useMemo(() => {
    const weeks: Date[][] = [];

    for (
      let index = 0;
      index < calendarDays.length;
      index += 7
    ) {
      weeks.push(
        calendarDays.slice(index, index + 7),
      );
    }

    return weeks;
  }, [calendarDays]);

  const lessonDateKeys = useMemo(() => {
    const dateKeys = new Set<string>();

    if (!schedule) {
      return dateKeys;
    }

    for (const date of calendarDays) {
      if (!isDateInsideSemester(date)) {
        continue;
      }

      const lessons = getLessonsForDate(
        schedule,
        date,
      );

      if (lessons.length > 0) {
        dateKeys.add(getDateKey(date));
      }
    }

    return dateKeys;
  }, [calendarDays, schedule]);

  const canShowPreviousMonth = isAfter(
    displayedMonth,
    FIRST_SEMESTER_MONTH,
  );

  const canShowNextMonth = isBefore(
    displayedMonth,
    LAST_SEMESTER_MONTH,
  );

  const handlePreviousMonth = () => {
    if (!canShowPreviousMonth) {
      return;
    }

    setDisplayedMonth((currentMonth) =>
      addMonths(currentMonth, -1),
    );
  };

  const handleNextMonth = () => {
    if (!canShowNextMonth) {
      return;
    }

    setDisplayedMonth((currentMonth) =>
      addMonths(currentMonth, 1),
    );
  };

  const handleDateChange = (date: Date) => {
    if (!isDateInsideSemester(date)) {
      return;
    }

    onDateChange(date);
  };

  const monthTitle = capitalize(
    format(displayedMonth, 'LLLL yyyy', {
      locale: ru,
    }),
  );

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-slate-900">
          {monthTitle}
        </h2>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePreviousMonth}
            disabled={!canShowPreviousMonth}
            aria-label="Предыдущий месяц"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft
              size={18}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={!canShowNextMonth}
            aria-label="Следующий месяц"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight
              size={18}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-7">
        {WEEKDAY_NAMES.map((weekday) => (
          <div
            key={weekday}
            className={[
              'py-2 text-center text-xs font-medium',
              weekday === 'Сб' ||
              weekday === 'Вс'
                ? 'text-rose-400'
                : 'text-slate-500',
            ].join(' ')}
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {calendarWeeks.map((week) => {
          const firstSemesterDate =
            week.find((date) =>
              isDateInsideSemester(date),
            );

          let weekBackground =
            'bg-slate-50/40';

          if (firstSemesterDate) {
            const academicWeek =
              getAcademicWeekInfo(
                firstSemesterDate,
              );

            weekBackground =
              academicWeek.parity === 'EVEN'
                ? 'bg-indigo-50/80'
                : 'bg-amber-50/80';
          }

          return (
            <div
              key={week[0].toISOString()}
              className={[
                'grid grid-cols-7 overflow-hidden rounded-xl',
                weekBackground,
              ].join(' ')}
            >
              {week.map((date) => {
                const isSelected = isSameDay(
                  date,
                  selectedDate,
                );

                const isToday = isSameDay(
                  date,
                  today,
                );

                const isCurrentMonth =
                  isSameMonth(
                    date,
                    displayedMonth,
                  );

                const isAvailable =
                  isDateInsideSemester(date);

                const hasLessons =
                  lessonDateKeys.has(
                    getDateKey(date),
                  );

                const isWeekendDay =
                  isWeekend(date);

                let dateClassName =
                  'text-slate-700 hover:bg-white/70';

                if (
                  isWeekendDay &&
                  isCurrentMonth
                ) {
                  dateClassName =
                    'text-rose-500 hover:bg-white/70';
                }

                if (!isCurrentMonth) {
                  dateClassName =
                    'text-slate-300';
                }

                if (isToday) {
                  dateClassName =
                    'bg-white text-indigo-600 ring-2 ring-inset ring-indigo-500';
                }

                if (isSelected) {
                  dateClassName =
                    'bg-indigo-600 text-white shadow-md shadow-indigo-200';
                }

                if (!isAvailable) {
                  dateClassName =
                    'cursor-not-allowed text-slate-300 opacity-60';
                }

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() =>
                      handleDateChange(date)
                    }
                    aria-label={format(
                      date,
                      'd MMMM yyyy, EEEE',
                      {
                        locale: ru,
                      },
                    )}
                    aria-pressed={isSelected}
                    aria-current={
                      isToday
                        ? 'date'
                        : undefined
                    }
                    className={[
                      'relative flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition',
                      dateClassName,
                    ].join(' ')}
                  >
                    {format(date, 'd')}

                    {hasLessons && (
                      <span
                        className={[
                          'absolute bottom-1 size-1 rounded-full',
                          isSelected
                            ? 'bg-white'
                            : 'bg-indigo-500',
                        ].join(' ')}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded bg-indigo-100" />

          <span className="text-[11px] text-slate-500">
            Чётная неделя
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="size-3 rounded bg-amber-100" />

          <span className="text-[11px] text-slate-500">
            Нечётная неделя
          </span>
        </div>
      </div>
    </aside>
  );
}