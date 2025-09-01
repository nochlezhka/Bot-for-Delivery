import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

import type { Gender, UserRoles } from 'pickup-point-db';

export const registerRequestSchema = z.object({
  phone: z.string({ message: 'Номер телефона обязателен' }).refine((phone) => {
    const res = parsePhoneNumberFromString(phone);
    return res && res.isValid();
  }, 'Введите корректный номер телефона'),
  gender: z.enum(['female', 'male'] as const satisfies Array<Gender>, {
    message: 'Необходимо указать пол',
  }),
});

export const createRequestSchema = z.object({
  name: z
    .string({ message: 'Необходимо указать Имя' })
    .nonempty({ message: 'Необходимо указать Имя' }),
  gender: z.enum(['female', 'male'] as const satisfies Array<Gender>, {
    message: 'Необходимо указать пол',
  }),
  phone: z.string({ message: 'Номер телефона обязателен' }).refine((phone) => {
    const res = parsePhoneNumberFromString(phone);
    return res && res.isValid();
  }, 'Введите корректный номер телефона'),
  tgUsername: z.string().nullable(),
  tgId: z
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
    ] as const satisfies Array<UserRoles>,
    {
      message: 'Необходимо указать роль',
    }
  ),
});

export const updateRequestSchema = createRequestSchema.partial().extend({
  id: z.string(),
});
