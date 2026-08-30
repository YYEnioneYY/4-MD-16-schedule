import {
  Check,
  Copy,
  Share2,
  TriangleAlert,
} from 'lucide-react';

import type {
  ScheduleLesson,
} from '@/entities/schedule';

import {
  createLessonShareContent,
} from '../lib/create-lesson-share-content';

import {
  useShareLesson,
} from '../model/use-share-lesson';

interface ShareLessonButtonProps {
  lesson: ScheduleLesson;
  selectedDate: Date;
}

export function ShareLessonButton({
  lesson,
  selectedDate,
}: ShareLessonButtonProps) {
  const {
    status,
    shareLesson,
  } = useShareLesson();

  const handleShare = () => {
    const content =
      createLessonShareContent(
        lesson,
        selectedDate,
      );

    void shareLesson({
      ...content,
      url: window.location.href,
    });
  };

  const Icon =
    status === 'SHARED'
      ? Check
      : status === 'COPIED'
        ? Copy
        : status === 'ERROR'
          ? TriangleAlert
          : Share2;

  const label =
    status === 'SHARED'
      ? 'Отправлено'
      : status === 'COPIED'
        ? 'Скопировано'
        : status === 'ERROR'
          ? 'Не удалось'
          : 'Поделиться';

  return (
    <button
      type="button"
      onClick={handleShare}
      className={[
        'inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4',
        status === 'ERROR'
          ? 'border-red-200 bg-red-50 text-red-600 focus:ring-red-100'
          : status === 'SHARED' ||
              status === 'COPIED'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 focus:ring-emerald-100'
            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:ring-indigo-100',
      ].join(' ')}
    >
      <Icon
        size={17}
        aria-hidden="true"
      />

      <span aria-live="polite">
        {label}
      </span>
    </button>
  );
}