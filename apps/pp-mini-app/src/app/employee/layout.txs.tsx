'use client';

import { useAtomValue } from 'jotai/react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

import { isEmployeeAtom } from '@/entity/employee/state';

export default function EmployeeLayout({ children }: PropsWithChildren) {
  const isEmployee = useAtomValue(isEmployeeAtom);
  const { replace } = useRouter();

  useEffect(() => {
    if (isEmployee === false) {
      replace('/');
    }
  }, [isEmployee, replace]);

  let result = <></>;
  if (isEmployee) {
    result = <>{children}</>;
  }
  return result;
}
