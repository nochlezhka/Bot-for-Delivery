'use client';
import { createContext } from 'react';

import type { project } from 'pickup-point-db/browser';

export const PickupPointFormContext = createContext({
  trigerFieldSubmit: (field: keyof project) => {
    //pass
  },
});
