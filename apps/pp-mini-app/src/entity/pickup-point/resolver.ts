import { zodResolver } from '@hookform/resolvers/zod';

import {
  createRequestSchema,
  updateRequestSchema,
} from '@/api/pickup-point/schema';

export const updatePickupPointResolver = zodResolver(updateRequestSchema);
export const createPickupPointResolver = zodResolver(createRequestSchema);
