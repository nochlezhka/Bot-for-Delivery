import { clsx } from 'clsx';
import { users } from 'pickup-point-db/browser';
import { HTMLProps } from 'react';

interface ProfileLinkProps extends HTMLProps<HTMLDivElement> {
  profile: Pick<users, 'phone' | 'tg_username'>;
}

export const ProfileLink = ({ className, profile }: ProfileLinkProps) => {
  const link = `${
    profile.tg_username ??
    profile.phone.replaceAll('-', '').replaceAll(/\s*/g, '')
  }`;
  return (
    <a href={`https://t.me/${link}`} className={clsx(className, 'link')}>
      @{link}
    </a>
  );
};
