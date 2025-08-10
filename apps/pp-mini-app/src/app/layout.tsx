import './_assets/globals.css';

import { ToastContainer } from '@/shared/ui/Toaster';
import { AppLayout } from '@/widget/AppLayout';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Ночлежка. Пункт выдачи',
  description: 'Бот для координации волонтеров пункта выдачи',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru" className="select-none">
      <body>
        <AppLayout>{children}</AppLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
