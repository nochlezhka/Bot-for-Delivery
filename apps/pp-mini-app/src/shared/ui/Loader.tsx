'use client';
import { useEffect } from 'react';

export const Loader = () => {
  useEffect(() => {
    import('ldrs').then((m) => m.ping.register());
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <l-ping size="45" speed="2" color="var(--tg-theme-secondary-bg-color)" />
  );
};
