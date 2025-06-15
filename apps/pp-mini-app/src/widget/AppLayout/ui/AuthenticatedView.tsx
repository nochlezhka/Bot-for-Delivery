'use client';

import { clsx } from 'clsx';
import { atom } from 'jotai';
import { useAtomValue } from 'jotai/react';
import { BriefcaseBusiness, CalendarSearch, User, Users } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { HTMLProps, PropsWithChildren } from 'react';

import { isEmployeeAtom } from '@/entity/employee/state';
import { roleAtom } from '@/entity/user/state';

const tabListAtom = atom((get) => {
  const result = [];
  const isEmployee = get(isEmployeeAtom);
  const role = get(roleAtom);
  if (role) {
    result.push(
      {
        link: '/',
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <CalendarSearch className={className} />
        ),
        title: 'Календарь',
      },
      {
        link: '/planned',
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <BriefcaseBusiness className={className} />
        ),
        title: 'Дежурства',
      },
      {
        link: '/profile',
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <User className={className} />
        ),
        title: 'Профиль',
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

export const AuthenticatedView = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const tabList = useAtomValue(tabListAtom);

  return (
    <div className="!grid grid-rows-[50px_1fr] w-full gap-2">
      <div role="tablist" className="tabs tabs-box tabs-sm rounded-none">
        {tabList.map(({ link, title, Icon }) => (
          <NextLink
            key={link}
            href={link}
            role="tab"
            className={clsx(
              pathname === link ? 'tab-active' : null,
              'tab flex justify-center items-center [&>span]:flex flex-grow self-center'
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:flex font-light ml-2">{title}</span>
          </NextLink>
        ))}
      </div>
      {children}
    </div>
  );
};
