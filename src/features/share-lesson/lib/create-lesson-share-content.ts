import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
  getAcademicWeekInfo,
  type LessonType,
  type ScheduleLesson,
} from '@/entities/schedule';

interface LessonShareContent {
  title: string;
  text: string;
}

const LESSON_TYPE_LABELS: Record<
  LessonType,
  string
> = {
  LECTURE: 'Лекция',
  PRACTICE: 'Практика',
  LABORATORY: 'Лабораторная',
};

function capitalize(value: string): string {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export function createLessonShareContent(
  lesson: ScheduleLesson,
  selectedDate: Date,
): LessonShareContent {
  const academicWeek =
    getAcademicWeekInfo(selectedDate);

  const dateLabel = capitalize(
    format(
      selectedDate,
      'EEEE, d MMMM yyyy',
      {
        locale: ru,
      },
    ),
  );

  const parityLabel =
    academicWeek.parity === 'ODD'
      ? 'Нечётная неделя'
      : 'Чётная неделя';

  const weekTypeLabel =
    academicWeek.weekType ===
    'NUMERATOR'
      ? 'Числитель'
      : 'Знаменатель';

  const lessonTypeLabel =
    LESSON_TYPE_LABELS[
      lesson.lessonType
    ];

  const location =
    lesson.location.format === 'ONLINE'
      ? 'Дистанционное обучение · ДО'
      : [
          lesson.location.room,
          lesson.location.building,
        ]
          .filter(Boolean)
          .join(' · ');

  const text = [
    `📚 ${lesson.subject.name}`,
    '',
    `📅 ${dateLabel}`,
    `🕐 ${lesson.time.start}–${lesson.time.end}`,
    `👤 ${lesson.teacher.shortName}`,
    `📍 ${location}`,
    `🎓 ${lessonTypeLabel}`,
    `📌 ${parityLabel} · ${weekTypeLabel}`,
  ].join('\n');

  return {
    title: `Пара: ${lesson.subject.name}`,
    text,
  };
}