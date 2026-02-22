'use client';
import { clearStack, connectLogger, context } from '@reatom/core';
import { reatomContext } from '@reatom/react';
import { PropsWithChildren } from 'react';

clearStack();

const rootFrame = context.start();
if (process.env.NODE_ENV !== 'production') {
  rootFrame.run(connectLogger);
}
export const ReatomProvider = ({ children }: PropsWithChildren) => {
  return (
    <reatomContext.Provider value={rootFrame}>
      {children}
    </reatomContext.Provider>
  );
};
