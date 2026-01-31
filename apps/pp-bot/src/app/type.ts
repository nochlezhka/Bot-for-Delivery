import { user_gender, user_role } from 'pickup-point-db/client';
import { Scenes } from 'telegraf';

export type RegisteredUser = {
  gender: user_gender;
  id: string;
  role: user_role;
  tgId: number;
};

export type TelegrafContext = Scenes.SceneContext;
export type UnregisteredUser = {
  id: null;
  role: null;
  tgId: number;
};

export type User = RegisteredUser | UnregisteredUser;
