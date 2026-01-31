import { atom } from 'jotai';
import { useAtomValue } from 'jotai/react';
import {
  BriefcaseBusiness,
  CalendarSearch,
  Store,
  TableOfContents,
  User,
  Users,
  X,
} from 'lucide-react';
import { usePathname } from 'next/dist/client/components/navigation';
import NextLink from 'next/link';
import { HTMLProps, useMemo } from 'react';

import { isEmployeeAtom } from '@/entity/employee/state';
import { roleAtom } from '@/entity/user/state';

const tabListAtom = atom((get) => {
  const result = [];
  const isEmployee = get(isEmployeeAtom);
  const role = get(roleAtom);
  if (role) {
    result.push(
      {
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <User className={className} />
        ),
        link: '/profile',
        title: 'Профиль',
      },
      {
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <BriefcaseBusiness className={className} />
        ),
        link: '/planned',
        title: 'Дежурства',
      },
      {
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <CalendarSearch className={className} />
        ),
        link: '/',
        title: 'Календарь',
      }
    );
  }
  if (isEmployee) {
    result.unshift(
      {
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <Store className={className} />
        ),
        link: '/employee/pp',
        title: 'Пункты выдачи',
      },
      {
        Icon: ({ className }: Pick<HTMLProps<HTMLElement>, 'className'>) => (
          <Users className={className} />
        ),
        link: '/employee/users',
        title: 'Пользователи',
      }
    );
  }
  return result;
});

export const CurrentPageSelect = () => {
  const pathname = usePathname();
  const tabList = useAtomValue(tabListAtom);
  const currentTab = useMemo(
    () => tabList.find((s) => s.link === pathname),
    [tabList, pathname]
  );
  return (
    <div className="fab">
      <div
        className="btn btn-lg btn-circle btn-success"
        role="button"
        tabIndex={0}
      >
        {currentTab ? (
          <currentTab.Icon className="size-4 shrink-0" />
        ) : (
          <TableOfContents className="size-4 shrink-0" />
        )}
      </div>
      <div className="fab-main-action btn btn-circle btn-lg" role="button">
        <X className="size-4 shrink-0" />
      </div>
      {tabList
        .filter((tab) => tab.link !== currentTab?.link)
        .map((tab, i) => (
          <NextLink
            className="btn btn-lg btn-circle"
            href={tab.link}
            key={`${tab.link}-${i}`}
            onClick={(e) => {
              e.currentTarget.blur();
            }}
          >
            <tab.Icon className="size-4 shrink-0" />
          </NextLink>
        ))}
    </div>
  );
};
