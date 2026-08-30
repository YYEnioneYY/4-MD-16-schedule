import { useState } from 'react';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
  getInitialScheduleDate,
} from '@/entities/schedule';

import {
  WeekNavigation,
} from '@/features/week-navigation';

import {
  DaySchedule,
} from '@/widgets/day-schedule';

import {
  getCurrentDateTime,
} from '@/shared/config/date-time';

import {
  NextLesson,
} from '@/widgets/next-lesson';

import {
  ScheduleCalendar,
} from '@/widgets/schedule-calendar';

import {
  WeekSummaryWidget,
} from '@/widgets/week-summary';

import {
  InstallAppButton,
} from '@/features/install-app';

export function SchedulePage() {
  const [selectedDate, setSelectedDate] =
  useState<Date>(() =>
    getInitialScheduleDate(
      getCurrentDateTime(),
    ),
  );

  const formattedSelectedDate = format(
    selectedDate,
    'd MMMM, EEEE',
    {
      locale: ru,
    },
  );

  return (
    <main className="min-h-screen bg-[#f7f8fc] p-4 text-slate-900 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              4-МД-16
            </span>
        
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Расписание занятий
            </h1>
        
            <p className="mt-2 capitalize text-slate-500">
              {formattedSelectedDate}
            </p>
          </div>
        
          <InstallAppButton />
        </header>

        <WeekNavigation
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <div className="grid gap-x-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <DaySchedule
            selectedDate={selectedDate}
          />

          <div className="mt-6 space-y-6 xl:sticky xl:top-6 xl:self-start">
            <NextLesson />
          
            <ScheduleCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          
            <WeekSummaryWidget
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}