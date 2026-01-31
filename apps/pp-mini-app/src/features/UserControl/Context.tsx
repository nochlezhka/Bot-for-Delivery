'use client';
import { createContext } from 'react';

import type { users } from 'pickup-point-db/browser';

export const UserFormContext = createContext({
  trigerFieldSubmit: (field: keyof Omit<users, 'project_id'>) => {
    //pass
  },
});
