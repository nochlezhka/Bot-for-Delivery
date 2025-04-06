'use client';

import { TabsList } from '@telegram-apps/telegram-ui';
import { atom } from 'jotai';
import { useAtomValue } from 'jotai/react';
import { BriefcaseBusiness, CalendarSearch, User, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { isEmployeeAtom } from '@/entity/employee';
import { roleAtom } from '@/entity/user';

const tabListAtom = atom((get) => {
  const result = [];
  const isEmployee = get(isEmployeeAtom);
  const role = get(roleAtom);
  if (role) {
    result.push(
      {
        link: '/',
        icon: <CalendarSearch />,
        title: 'Календарь',
      },
      {
        link: '/planned',
        icon: <BriefcaseBusiness />,
        title: 'Дежурства',
      },
      {
        link: '/profile',
        icon: <User />,
        title: 'Профиль',
      }
    );
  }
  if (isEmployee) {
    result.push({
      link: '/employee/users',
      icon: <Users />,
      title: 'Пользователи',
    });
  }
  return result;
});

export const AuthenticatedView = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const tabList = useAtomValue(tabListAtom);

  return (
    <div className="grid grid-rows-[50px_1fr] w-full px-1">
      <TabsList>
        {tabList.map(({ link, title, icon }) => (
          <TabsList.Item
            key={link}
            onClick={() => {
              router.push(link);
            }}
            selected={pathname === link}
            className="flex justify-center items-center [&>span]:flex"
          >
            {icon}
            <span className="hidden sm:flex font-light ml-2">{title}</span>
          </TabsList.Item>
        ))}
      </TabsList>
      {children}
    </div>
  );
};
