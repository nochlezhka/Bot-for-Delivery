'use client';
import type { project } from 'pickup-point-db/browser';

import { createContext } from 'react';

export const PickupPointFormContext = createContext({
  trigerFieldSubmit: (field: keyof project) => {
    //pass
  },
});
