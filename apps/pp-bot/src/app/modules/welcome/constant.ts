import { ReplyKeyboardRemove } from 'telegraf/types';

export const WELCOME_SCENE_ID = 'WELCOME_SCENE';
export const REQUEST_CONTACT_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [
        {
          request_contact: true,
          text: '📲 Поделиться номером телефона',
        },
      ],
    ],
    one_time_keyboard: true,
  },
};

export const REQUEST_GENDER_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [
      [
        { callback_data: 'male', text: 'Мужчина' },
        { callback_data: 'female', text: 'Женщина' },
      ],
    ],
  },
};

export const REMOVE_KEYBOARD: { reply_markup: ReplyKeyboardRemove } = {
  reply_markup: {
    remove_keyboard: true,
  },
};
