import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { useMaskito } from '@maskito/react';
import metadata from 'libphonenumber-js/min/metadata';

const options = maskitoPhoneOptionsGenerator({
  countryIsoCode: 'RU',
  metadata,
  strict: true,
});
export const usePhoneMask = () => useMaskito({ options });
