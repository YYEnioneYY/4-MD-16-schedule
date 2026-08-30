import {
  Download,
} from 'lucide-react';

import {
  useInstallApp,
} from '../model/use-install-app';

export function InstallAppButton() {
  const {
    canInstall,
    installApp,
  } = useInstallApp();

  if (!canInstall) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        void installApp();
      }}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
    >
      <Download
        size={17}
        aria-hidden="true"
      />

      Установить
    </button>
  );
}