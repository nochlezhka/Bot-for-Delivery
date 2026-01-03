import type { user_gender } from 'pickup-point-db/browser';

export const GENDER_NAMES: Record<user_gender, string> = {
  female: 'Женский',
  male: 'Мужской',
};
export const GENDER_VALUES: Array<user_gender> = ['female', 'male'];
