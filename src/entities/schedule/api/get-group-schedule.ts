import type { GroupScheduleResponse } from '../model/types';

import { groupScheduleMock } from './schedule.mock';

const MOCK_REQUEST_DELAY = 500;

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export async function getGroupSchedule(): Promise<GroupScheduleResponse> {
  await wait(MOCK_REQUEST_DELAY);

  return structuredClone(groupScheduleMock);
}