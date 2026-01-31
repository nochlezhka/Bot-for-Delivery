import './_assets/globals.css';

import { clsx } from 'clsx';
import localFont from 'next/font/local';

import { ToastContainer } from '@/shared/ui/Toaster';
import { AppLayout } from '@/widget/AppLayout';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

const nunito = localFont({
  src: './_assets/fonts/nunito/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf',
  variable: '--nunito-font',
});

export const metadata: Metadata = {
  title: 'Ночлежка. Пункт выдачи',
  description: 'Бот для координации волонтеров пункта выдачи',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru" className={clsx(nunito.variable, 'select-none')}>
      <body>
        <AppLayout>{children}</AppLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
