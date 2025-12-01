import { ReplyKeyboardRemove } from 'telegraf/types';

export const WELCOME_SCENE_ID = 'WELCOME_SCENE';
export const REQUEST_CONTACT_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [
        {
          text: '📲 Поделиться номером телефона',
          request_contact: true,
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
        { text: 'Мужчина', callback_data: 'male' },
        { text: 'Женщина', callback_data: 'female' },
      ],
    ],
  },
};

export const REMOVE_KEYBOARD: { reply_markup: ReplyKeyboardRemove } = {
  reply_markup: {
    remove_keyboard: true,
  },
};
