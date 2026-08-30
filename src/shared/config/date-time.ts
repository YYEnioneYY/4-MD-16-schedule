/**
 * true — используем тестовую дату;
 * false — используем реальную дату устройства.
 */
const USE_MOCK_DATE_TIME = true;

const MOCK_DATE_TIME = new Date(
  2026,
  8,
  1,
  10,
  45,
  0,
);

const APP_STARTED_AT = Date.now();

export function getCurrentDateTime(): Date {
  if (!USE_MOCK_DATE_TIME) {
    return new Date();
  }

  const elapsedTime =
    Date.now() - APP_STARTED_AT;

  return new Date(
    MOCK_DATE_TIME.getTime() + elapsedTime,
  );
}