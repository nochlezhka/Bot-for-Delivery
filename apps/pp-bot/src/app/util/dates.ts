import { getUnixTime } from 'date-fns';
import { format } from 'date-fns/format';
import { ru } from 'date-fns/locale/ru';

export const formatUserDate = (date: Date | number | string) =>
  format(date, 'cccc, do MMMM', {
    locale: ru,
  });

export const encodeUserDate = (date: Date | number | string) =>
  getUnixTime(date);
