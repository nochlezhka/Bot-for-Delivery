'use client';
import type { users } from 'pickup-point-db/browser';

import { createContext } from 'react';

export const UserFormContext = createContext({
  trigerFieldSubmit: (field: keyof Omit<users, 'project_id'>) => {
    //pass
  },
});
