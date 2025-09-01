'use client';
import { createContext } from 'react';

import type { User } from 'pickup-point-db';

export const UserFormContext = createContext({
  trigerFieldSubmit: (field: keyof User) => {
    //pass
  },
});
