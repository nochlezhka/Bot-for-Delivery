'use client';

import { atom } from 'jotai';
import { useAtomValue } from 'jotai/react';
import {
  BriefcaseBusiness,
  CalendarSearch,
  TableOfContents,
  User,
  Users,
  X,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { HTMLProps, PropsWithChildren, useMemo } from 'react';

import { isEmployeeAtom } from '@/entity/employee/state';
import { roleAtom } from '@/entity/user/state';

const tabListAtom = atom((get) => {
  const result = [];
  const isEmployee = get(isEmployeeAtom);
  const role = get(roleAtom);
  if (role) {
    result.push(
      {
        link: '/profile',
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <User className={className} />
        ),
        title: 'Профиль',
      },
      {
        link: '/planned',
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <BriefcaseBusiness className={className} />
        ),
        title: 'Дежурства',
      },
      {
        link: '/',
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <CalendarSearch className={className} />
        ),
        title: 'Календарь',
      }
    );
  }
  if (isEmployee) {
    result.push({
      link: '/employee/users',
      Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
        <Users className={className} />
      ),
      title: 'Пользователи',
    });
  }
  return result;
});

const FabMenu = () => {
  const pathname = usePathname();
  const tabList = useAtomValue(tabListAtom);
  const currentTab = useMemo(
    () => tabList.find((s) => s.link === pathname),
    [tabList, pathname]
  );
  return (
    <div className="fab fab-flower">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-lg btn-circle btn-success"
      >
        {currentTab ? (
          <currentTab.Icon className="size-4 shrink-0" />
        ) : (
          <TableOfContents className="size-4 shrink-0" />
        )}
      </div>
      <div role="button" className="fab-main-action btn btn-circle btn-lg">
        <X className="size-4 shrink-0" />
      </div>
      {tabList.map((tab, i) => (
        <NextLink
          href={tab.link}
          className="btn btn-lg btn-circle"
          key={`${tab.link}-${i}`}
        >
          <tab.Icon className="size-4 shrink-0" />
        </NextLink>
      ))}
    </div>
  );
};

export const AuthenticatedView = ({ children }: PropsWithChildren) => {
  return (
    <div className="!grid grid-rows-1fr w-screen gap-2 overflow-hidden h-dvh">
      {children}
      <FabMenu />
    </div>
  );
};
