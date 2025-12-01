import { Scenes } from 'telegraf';

import type { UserRoles } from 'pickup-point-db';

export type RegisteredUser = {
  id: number;
  role: UserRoles;
  tgId: number;
};

export type UnregisteredUser = {
  id: null;
  role: null;
  tgId: number;
};
export type User = RegisteredUser | UnregisteredUser;

export type TelegrafContext = Scenes.SceneContext;
