import {
  useCallback,
  useEffect,
  useState,
} from 'react';

interface BeforeInstallPromptEvent
  extends Event {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome:
      | 'accepted'
      | 'dismissed';

    platform: string;
  }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt:
      BeforeInstallPromptEvent;

    appinstalled: Event;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

function checkIsInstalled(): boolean {
  return (
    window.matchMedia(
      '(display-mode: standalone)',
    ).matches ||
    navigator.standalone === true
  );
}

export function useInstallApp() {
  const [
    installPrompt,
    setInstallPrompt,
  ] =
    useState<BeforeInstallPromptEvent | null>(
      null,
    );

  const [isInstalled, setIsInstalled] =
    useState(() => checkIsInstalled());

  useEffect(() => {
    const handleBeforeInstallPrompt = (
      event: BeforeInstallPromptEvent,
    ) => {
      event.preventDefault();

      setInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt,
    );

    window.addEventListener(
      'appinstalled',
      handleAppInstalled,
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled,
      );
    };
  }, []);

  const installApp =
    useCallback(async () => {
      if (!installPrompt) {
        return;
      }

      await installPrompt.prompt();

      const choice =
        await installPrompt.userChoice;

      if (
        choice.outcome === 'accepted'
      ) {
        setIsInstalled(true);
      }

      setInstallPrompt(null);
    }, [installPrompt]);

  return {
    isInstalled,

    canInstall:
      installPrompt !== null &&
      !isInstalled,

    installApp,
  };
}