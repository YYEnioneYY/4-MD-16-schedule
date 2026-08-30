import {
  PwaUpdatePrompt,
} from '@/features/pwa-update';

import {
  SchedulePage,
} from '@/pages/schedule';

export default function App() {
  return (
    <>
      <SchedulePage />

      <PwaUpdatePrompt />
    </>
  );
}