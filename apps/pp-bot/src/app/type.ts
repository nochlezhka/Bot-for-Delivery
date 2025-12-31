import { user_role } from 'pickup-point-db/client';
import { Scenes } from 'telegraf';

export type RegisteredUser = {
  id: string;
  role: user_role;
  tgId: number;
};

export type UnregisteredUser = {
  id: null;
  role: null;
  tgId: number;
};
export type User = RegisteredUser | UnregisteredUser;

export type TelegrafContext = Scenes.SceneContext;
