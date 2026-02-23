import type { user_gender } from 'pickup-point-db/browser';

import { Mars, Venus, VenusAndMars } from 'lucide-react';
import { ReactNode } from 'react';

interface GenderIconProps {
  gender: null | undefined | user_gender;
}

const genderIcon: Record<string, ReactNode> = {
  allAllowed: <VenusAndMars className="h-3.5 w-3.5 text-purple-500" />,
  female: <Venus className="h-3.5 w-3.5 text-pink-500" />,
  male: <Mars className="h-3.5 w-3.5 text-blue-500" />,
};

export const GenderIcon = ({ gender }: GenderIconProps) => {
  return gender === undefined ? <></> : genderIcon[gender ?? 'allAllowed'];
};
