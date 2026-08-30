import {
  useEffect,
  useState,
} from 'react';

import {
  getCurrentDateTime,
} from '@/shared/config/date-time';

const DEFAULT_UPDATE_INTERVAL = 15_000;

export function useCurrentTime(
  updateInterval = DEFAULT_UPDATE_INTERVAL,
): Date {
  const [currentTime, setCurrentTime] =
    useState(() => getCurrentDateTime());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(getCurrentDateTime());
    }, updateInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [updateInterval]);

  return currentTime;
}