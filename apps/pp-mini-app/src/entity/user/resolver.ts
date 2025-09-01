import { zodResolver } from '@hookform/resolvers/zod';

import { createRequestSchema, updateRequestSchema } from '@/api/user/schema';

export const updateUserResolver = zodResolver(updateRequestSchema);
export const createUserResolver = zodResolver(createRequestSchema);
