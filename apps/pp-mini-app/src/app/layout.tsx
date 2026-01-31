import './_assets/globals.css';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { clsx } from 'clsx';
import localFont from 'next/font/local';

import { ReatomProvider } from '@/shared/reatom';
import { ToastContainer } from '@/shared/ui/Toaster';
import { AppLayout } from '@/widget/AppLayout';

const nunito = localFont({
  src: './_assets/fonts/nunito/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf',
  variable: '--nunito-font',
});

export const metadata: Metadata = {
  description: 'Бот для координации волонтеров пункта выдачи',
  title: 'Ночлежка. Пункт выдачи',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={clsx(nunito.variable, 'select-none')} lang="ru">
      <body>
        <ReatomProvider>
          <AppLayout>{children}</AppLayout>
          <ToastContainer />
        </ReatomProvider>
      </body>
    </html>
  );
}
