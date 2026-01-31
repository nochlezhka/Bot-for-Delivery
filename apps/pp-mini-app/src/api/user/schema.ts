import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { user_gender, user_role } from 'pickup-point-db/client';
import { z } from 'zod';

export const registerRequestSchema = z.object({
  gender: z.enum(['female', 'male'] as const satisfies Array<user_gender>, {
    message: 'Необходимо указать пол',
  }),
  phone: z.string({ message: 'Номер телефона обязателен' }).refine((phone) => {
    const res = parsePhoneNumberFromString(phone);
    return res && res.isValid();
  }, 'Введите корректный номер телефона'),
});

export const createRequestSchema = z.object({
  gender: z.enum(['female', 'male'] as const satisfies Array<user_gender>, {
    message: 'Необходимо указать пол',
  }),
  name: z
    .string({ message: 'Необходимо указать Имя' })
    .nonempty({ message: 'Необходимо указать Имя' }),
  phone: z.string({ message: 'Номер телефона обязателен' }).refine((phone) => {
    const res = parsePhoneNumberFromString(phone);
    return res && res.isValid();
  }, 'Введите корректный номер телефона'),
  role: z.enum(
    [
      'employee',
      'guest',
      'volunteer',
      'coordinator',
    ] as const satisfies Array<user_role>,
    {
      message: 'Необходимо указать роль',
    }
  ),
  tg_id: z
    .string()
    .or(z.bigint())
    .nullable()
    .transform<bigint | null>((x) => (x !== null ? BigInt(x) : x)),
  tg_username: z.string().nullable(),
});

export const updateRequestSchema = createRequestSchema.partial().extend({
  id: z.string(),
});
