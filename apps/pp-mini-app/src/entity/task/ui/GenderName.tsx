import type { user_gender } from 'pickup-point-db/browser';

interface GenderNameProps {
  gender: null | undefined | user_gender;
}

const genderName: Record<string, string> = {
  allAllowed: 'Мужская+Женская',
  female: 'Женская',
  male: 'Мужская',
};

export const GenderName = ({ gender }: GenderNameProps) => {
  return gender === undefined ? <></> : genderName[gender ?? 'allAllowed'];
};
