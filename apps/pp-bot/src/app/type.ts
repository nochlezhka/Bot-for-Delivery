import { Scenes } from 'telegraf';

import type { UserRoles } from 'pickup-point-db';

export type BaseContext = Scenes.SceneContext;
export type User = {
    id: number;
    role: UserRoles;
    tgId: number;
  };


export interface TelegrafContext extends BaseContext {
  user?: User | null;
}
