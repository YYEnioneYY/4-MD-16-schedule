export function SchedulePage() {
  const currentDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(new Date());

  return (
    <main className="min-h-screen bg-[#f7f8fc] p-4 text-slate-900 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <span className="mb-4 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
            ИВТ-24-1
          </span>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Расписание занятий
          </h1>

          <p className="mt-2 capitalize text-slate-500">
            Сегодня, {currentDate}
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Чётная неделя
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Занятия на сегодня
              </h2>
            </div>

            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Выбрать дату
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="font-medium text-slate-700">
              Здесь скоро появится расписание
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Tailwind CSS успешно подключён
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}