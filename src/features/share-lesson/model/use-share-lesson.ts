import {
  useCallback,
  useEffect,
  useState,
} from 'react';

export type ShareLessonStatus =
  | 'IDLE'
  | 'SHARED'
  | 'COPIED'
  | 'ERROR';

interface ShareLessonData {
  title: string;
  text: string;
  url?: string;
}

const STATUS_RESET_DELAY = 2500;

async function copyText(
  text: string,
): Promise<void> {
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(
      text,
    );

    return;
  }

  const textarea =
    document.createElement('textarea');

  textarea.value = text;
  textarea.readOnly = true;

  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);

  textarea.select();

  const isCopied =
    document.execCommand('copy');

  document.body.removeChild(textarea);

  if (!isCopied) {
    throw new Error(
      'Не удалось скопировать текст',
    );
  }
}

export function useShareLesson() {
  const [status, setStatus] =
    useState<ShareLessonStatus>('IDLE');

  useEffect(() => {
    if (status === 'IDLE') {
      return;
    }

    const timeoutId = window.setTimeout(
      () => {
        setStatus('IDLE');
      },
      STATUS_RESET_DELAY,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [status]);

  const shareLesson = useCallback(
    async ({
      title,
      text,
      url,
    }: ShareLessonData) => {
      setStatus('IDLE');

      const shareData: ShareData = {
        title,
        text,
        url,
      };

      const clipboardText = url
        ? `${text}\n\n${url}`
        : text;

      const canUseWebShare =
        typeof navigator.share ===
          'function' &&
        (typeof navigator.canShare !==
          'function' ||
          navigator.canShare(shareData));

      if (canUseWebShare) {
        try {
          await navigator.share(
            shareData,
          );

          setStatus('SHARED');

          return;
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === 'AbortError'
          ) {
            return;
          }
        }
      }

      try {
        await copyText(clipboardText);

        setStatus('COPIED');
      } catch {
        setStatus('ERROR');
      }
    },
    [],
  );

  return {
    status,
    shareLesson,
  };
}