import { AppLayout } from '@/widget/AppLayout';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import './_assets/globals.css';

export const metadata: Metadata = {
  title: 'Ночлежка. Пункт выдачи',
  description: 'Бот для координации волонтеров пункта выдачи',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru" className="select-none">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
