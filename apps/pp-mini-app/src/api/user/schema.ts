import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

export const registerRequestSchema = z.object({
  phone: z.string({ message: 'Номер телефона обязателен' }).refine((phone) => {
    const res = parsePhoneNumberFromString(phone);
    return res && res.isValid();
  }, 'Введите корректный номер телефона'),
  gender: z.enum(['male', 'female'], { message: 'Необходимо указать пол' }),
});
