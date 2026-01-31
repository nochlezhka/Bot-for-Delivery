import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { user_gender, user_role } from 'pickup-point-db/client';
import { z } from 'zod';

export const registerRequestSchema = z.object({
  phone: z.string({ message: 'Номер телефона обязателен' }).refine((phone) => {
    const res = parsePhoneNumberFromString(phone);
    return res && res.isValid();
  }, 'Введите корректный номер телефона'),
  gender: z.enum(['female', 'male'] as const satisfies Array<user_gender>, {
    message: 'Необходимо указать пол',
  }),
});

export const createRequestSchema = z.object({
  name: z
    .string({ message: 'Необходимо указать Имя' })
    .nonempty({ message: 'Необходимо указать Имя' }),
  gender: z.enum(['female', 'male'] as const satisfies Array<user_gender>, {
    message: 'Необходимо указать пол',
  }),
  phone: z.string({ message: 'Номер телефона обязателен' }).refine((phone) => {
    const res = parsePhoneNumberFromString(phone);
    return res && res.isValid();
  }, 'Введите корректный номер телефона'),
  tg_username: z.string().nullable(),
  tg_id: z
    .string()
    .or(z.bigint())
    .nullable()
    .transform<bigint | null>((x) => (x !== null ? BigInt(x) : x)),
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
});

export const updateRequestSchema = createRequestSchema.partial().extend({
  id: z.string(),
});
