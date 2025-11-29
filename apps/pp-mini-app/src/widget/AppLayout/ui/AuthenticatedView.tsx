'use client';

import { ScrollArea } from '@ark-ui/react';
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
    <div className="!grid grid-rows-[50px_1fr] w-screen gap-2 overflow-hidden h-dvh">
      <ScrollArea.Root className="w-full overflow-hidden sticky! top-0">
        <ScrollArea.Viewport>
          <ScrollArea.Content
            role="tablist"
            className="tabs tabs-box tabs-sm rounded-none grid grid-flow-col auto-cols-[calc(100vw/3)]"
          >
            {tabList.map(({ link, title, Icon }) => (
              <NextLink
                key={link}
                href={link}
                role="tab"
                className={clsx(
                  pathname === link ? 'tab-active' : null,
                  'tab flex justify-center items-center [&>span]:flex flex-grow self-center flex-nowrap'
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden! min-[400px]:flex! font-light ml-2">
                  {title}
                </span>
              </NextLink>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="horizontal"
          className="data-[hover]:flex data-[dragging]:flex data-[scrolling]:flex hidden bg-transparent"
        >
          <ScrollArea.Thumb className="w-2 h-1 rounded-xl bg-secondary" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {children}
    </div>
  );
};
