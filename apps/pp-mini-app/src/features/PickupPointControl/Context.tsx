'use client';
import { createContext } from 'react';

import type { pickup_point } from 'pickup-point-db/browser';

export const PickupPointFormContext = createContext({
  trigerFieldSubmit: (field: keyof pickup_point) => {
    //pass
  },
});
