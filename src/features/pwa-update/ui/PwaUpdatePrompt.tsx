import {
  RefreshCw,
  WifiOff,
  X,
} from 'lucide-react';

import {
  useRegisterSW,
} from 'virtual:pwa-register/react';

const UPDATE_INTERVAL =
  60 * 60 * 1000;

export function PwaUpdatePrompt() {
  const {
    offlineReady: [
      offlineReady,
      setOfflineReady,
    ],
  
    needRefresh: [
      needRefresh,
      setNeedRefresh,
    ],
  
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(
      _serviceWorkerUrl: string,
      registration:
        | ServiceWorkerRegistration
        | undefined,
    ) {
      if (!registration) {
        return;
      }
  
      window.setInterval(() => {
        if (navigator.onLine) {
          void registration.update();
        }
      }, UPDATE_INTERVAL);
    },
  });

  const isVisible =
    offlineReady || needRefresh;

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    void updateServiceWorker(true);
  };

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:left-auto sm:right-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {needRefresh ? (
            <RefreshCw
              size={19}
              aria-hidden="true"
            />
          ) : (
            <WifiOff
              size={19}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {needRefresh
              ? 'Доступно обновление'
              : 'Расписание доступно офлайн'}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {needRefresh
              ? 'Обнови приложение, чтобы получить актуальную версию расписания.'
              : 'Теперь приложение можно открывать без подключения к интернету.'}
          </p>

          {needRefresh && (
            <button
              type="button"
              onClick={handleUpdate}
              className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Обновить
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть уведомление"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X
            size={17}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}