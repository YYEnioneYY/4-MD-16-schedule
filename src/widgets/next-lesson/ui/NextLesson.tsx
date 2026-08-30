import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addDays,
  format,
  isSameDay,
} from 'date-fns';

import { ru } from 'date-fns/locale';

import {
  BookOpenCheck,
  Clock3,
  FlaskConical,
  Presentation,
} from 'lucide-react';

import {
  getGroupSchedule,
  getNextLesson,
  type GroupScheduleResponse,
  type LessonType,
} from '@/entities/schedule';

import {
  useCurrentTime,
} from '@/shared/lib/hooks/use-current-time';

interface LessonStyle {
  icon: string;
  badge: string;
  progress: string;
}

const LESSON_STYLES: Record<
  LessonType,
  LessonStyle
> = {
  LECTURE: {
    icon: 'bg-indigo-50 text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-600',
    progress: '#4f46e5',
  },

  PRACTICE: {
    icon: 'bg-emerald-50 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-600',
    progress: '#10b981',
  },

  LABORATORY: {
    icon: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-600',
    progress: '#f59e0b',
  },
};

function getCountdownLabel(
  minutes: number,
): string {
  if (minutes < 60) {
    return `через ${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `через ${hours} ч`;
  }

  return `через ${hours} ч ${remainingMinutes} мин`;
}

function getRingTime(minutes: number): {
  value: string;
  unit: string;
} {
  if (minutes < 60) {
    return {
      value: String(minutes),
      unit: 'мин',
    };
  }

  return {
    value: String(Math.ceil(minutes / 60)),
    unit: 'ч',
  };
}

export function NextLesson() {
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

  const nextLesson = useMemo(() => {
    if (!schedule) {
      return null;
    }

    return getNextLesson(
      schedule,
      currentTime,
    );
  }, [schedule, currentTime]);

  if (isLoading) {
    return (
      <aside className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-5 w-36 rounded bg-slate-100" />

        <div className="mt-5 h-16 rounded-xl bg-slate-100" />
      </aside>
    );
  }

  if (!nextLesson) {
    return (
      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Clock3
            size={19}
            className="text-slate-400"
          />

          <h2 className="font-bold text-slate-900">
            Следующая пара
          </h2>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          Ближайших занятий нет
        </p>
      </aside>
    );
  }

  const {
    lesson,
    date,
    minutesUntil,
  } = nextLesson;

  const styles =
    LESSON_STYLES[lesson.lessonType];

  const LessonIcon =
    lesson.lessonType === 'LECTURE'
      ? Presentation
      : lesson.lessonType === 'LABORATORY'
        ? FlaskConical
        : BookOpenCheck;

  const ringTime =
    getRingTime(minutesUntil);

  /**
   * Кольцо постепенно заполняется
   * в течение последнего часа до пары.
   */
  const ringProgress = Math.max(
    0,
    Math.min(
      100,
      ((60 - Math.min(minutesUntil, 60)) /
        60) *
        100,
    ),
  );

  const isToday = isSameDay(
    date,
    currentTime,
  );

  const isTomorrow = isSameDay(
    date,
    addDays(currentTime, 1),
  );

  const dateLabel = isToday
    ? ''
    : isTomorrow
      ? 'Завтра · '
      : `${format(date, 'd MMM, EE', {
          locale: ru,
        })} · `;

  const room =
    lesson.location.format === 'ONLINE'
      ? 'ДО'
      : lesson.location.room;

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900">
          Следующая пара
        </h2>

        <span className="whitespace-nowrap text-xs font-semibold text-indigo-600">
          {getCountdownLabel(minutesUntil)}
        </span>
      </header>

      <div className="mt-5 flex items-center gap-3">
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
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
            {lesson.subject.name}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {dateLabel}
            {lesson.time.start}
            {room && ` · ${room}`}
          </p>
        </div>

        <div
          className="flex size-20 shrink-0 items-center justify-center rounded-full p-1"
          style={{
            background: `conic-gradient(
              ${styles.progress}
              ${ringProgress * 3.6}deg,
              #e2e8f0 0deg
            )`,
          }}
        >
          <div className="flex size-full flex-col items-center justify-center rounded-full bg-white">
            <span className="text-xl font-bold leading-none text-slate-900">
              {ringTime.value}
            </span>

            <span className="mt-1 text-[10px] font-medium text-slate-500">
              {ringTime.unit}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}